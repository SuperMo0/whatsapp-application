import { memo, useRef, useCallback, useEffect, useLayoutEffect, useState, useMemo } from 'react'
import type { Message } from 'super-chat-shared/chat';
import { useChatStore } from '../stores/chat.store.ts'
import UserChatHeader from './user-chat-header.jsx';
import MeBubble from './me-bubble.jsx'
import FriendBubble, { type BubbleSender } from './friend-bubble.jsx'
import ChatInput from './chat-input.jsx';
import { useCheckSession } from '../hooks/use-auth-queries.ts';
import { useChatMessages, useAllUsers } from '../hooks/use-chat-queries.ts';
import { useMarkMessageAsRead } from '../hooks/use-chat-mutations.ts';
import { ClipLoader } from 'react-spinners';
import { dayLabel } from '../utils/Dates.util.js';
import { buildMessageRows, type MessageRow } from '../utils/chat.util.ts';

const UNKNOWN_SENDER: BubbleSender = { name: 'Unknown', avatar: null };
// Within this distance of the newest message the list follows new arrivals.
const AT_BOTTOM_PX = 80;
// Start fetching the previous page this far before the top is reached, so a
// fast fling upward never outruns the network.
const PREFETCH_MARGIN_PX = 2000;

type MessageItemProps = {
    rowKey: string;
    message: Message;
    isNewDay: boolean;
    isNewSender: boolean;
    isRunEnd: boolean;
    isMine: boolean;
    animate: boolean;
    sender: BubbleSender;
};

const MessageItem = memo(function MessageItem({
    rowKey, message, isNewDay, isNewSender, isRunEnd, isMine, animate, sender
}: MessageItemProps) {
    return (
        <div data-key={rowKey}>
            {isNewDay && (
                <div className="flex justify-center py-3">
                    <span className="px-2.5 py-1 rounded-md bg-surface border border-line text-[11px] font-medium text-muted">
                        {dayLabel(message.timestamp)}
                    </span>
                </div>
            )}
            <div className={isNewSender && !isNewDay ? 'pt-2' : ''}>
                {isMine
                    ? <MeBubble message={message} animate={animate} />
                    : <FriendBubble message={message} sender={sender} showSender={isNewSender} isRunEnd={isRunEnd} animate={animate} />
                }
            </div>
            <div className="h-0.5" />
        </div>
    );
});

type MessageListProps = {
    rows: MessageRow[];
    authUserId: string | undefined;
    senders: Map<string, BubbleSender>;
    hasOlder: boolean;
    isFetchingOlder: boolean;
    loadOlder: () => void;
};

// The scroller is `flex-direction: column-reverse`, the technique web chat
// clients use to anchor a conversation to its newest message. The browser
// measures scroll position from the bottom, so:
// - it opens at the newest message with no scroll-to-bottom pass,
// - prepending older pages never moves what is on screen, with no JS
//   correction (corrections are what flicker, and on iOS they also cancel
//   momentum scrolling),
// - the list stays pinned to the bottom when the keyboard shrinks it.
// Content still renders top to bottom inside it, so reading order is normal.
function MessageList({ rows, authUserId, senders, hasOlder, isFetchingOlder, loadOlder }: MessageListProps) {
    const scrollerRef = useRef<HTMLDivElement>(null);
    const topSentinelRef = useRef<HTMLDivElement>(null);
    // Distance from the newest message, kept current on every scroll.
    const distanceFromBottom = useRef(0);
    const previousLastKey = useRef<string | null>(null);
    const [animatedKey, setAnimatedKey] = useState<string | null>(null);

    const onScroll = useCallback(() => {
        const el = scrollerRef.current;
        if (el) distanceFromBottom.current = Math.abs(el.scrollTop);
    }, []);

    const lastRow = rows[rows.length - 1];

    // Runs before paint, so whatever correction is needed lands in the same
    // frame as the new message and is never seen.
    useLayoutEffect(() => {
        const el = scrollerRef.current;
        if (!el || !lastRow) return;

        const prevKey = previousLastKey.current;
        previousLastKey.current = lastRow.key;
        if (prevKey === null || prevKey === lastRow.key) return;

        // The old last row is gone rather than followed by new ones, e.g. a
        // failed send rolled back: nothing arrived, so leave the scroll alone.
        const prevIndex = rows.findIndex(r => r.key === prevKey);
        if (prevIndex === -1) return;

        setAnimatedKey(lastRow.key);

        if (lastRow.message.senderId === authUserId || distanceFromBottom.current <= AT_BOTTOM_PX) {
            // My own message, or I was already at the newest: show it.
            el.scrollTop = 0;
        } else {
            // Reading history: a bottom-anchored list would push the visible
            // messages up by the new rows' height, so hold them in place.
            let added = 0;
            for (const row of rows.slice(prevIndex + 1)) {
                const node = el.querySelector<HTMLElement>(`[data-key="${CSS.escape(row.key)}"]`);
                added += node?.offsetHeight ?? 0;
            }
            el.scrollTop = -(distanceFromBottom.current + added);
        }

        distanceFromBottom.current = Math.abs(el.scrollTop);
    }, [lastRow?.key, rows, authUserId]);

    // Drop the entrance class once it has played, so it never replays.
    useEffect(() => {
        if (!animatedKey) return;
        const timer = setTimeout(() => setAnimatedKey(null), 400);
        return () => clearTimeout(timer);
    }, [animatedKey]);

    // Re-observed after every page, because an observer only reports
    // changes: if the sentinel is still in range once a page lands, observing
    // afresh reports that and fetches the next one.
    useEffect(() => {
        const root = scrollerRef.current;
        const target = topSentinelRef.current;
        if (!root || !target || !hasOlder || isFetchingOlder) return;
        if (typeof IntersectionObserver === 'undefined') return;

        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) loadOlder(); },
            { root, rootMargin: `${PREFETCH_MARGIN_PX}px 0px 0px 0px` }
        );
        observer.observe(target);
        return () => observer.disconnect();
    }, [hasOlder, isFetchingOlder, loadOlder, rows.length]);

    return (
        <div
            ref={scrollerRef}
            onScroll={onScroll}
            className="h-full w-full overflow-y-auto flex flex-col-reverse chat-scroller"
        >
            <div className="px-3 md:px-6 mx-auto w-full max-w-[56rem]">
                <div ref={topSentinelRef} aria-hidden="true" />
                {/* One fixed height whether or not the spinner shows, so
                    loading older messages never shifts the list. */}
                <div className="h-12 flex items-center justify-center">
                    {isFetchingOlder && (
                        <ClipLoader color='var(--sc-accent)' size={18} aria-label="Loading earlier messages" />
                    )}
                </div>

                {rows.map(row => {
                    const { message } = row;
                    const isMine = message.senderId === authUserId;
                    return (
                        <MessageItem
                            key={row.key}
                            rowKey={row.key}
                            message={message}
                            isNewDay={row.isNewDay}
                            isNewSender={row.isNewSender}
                            isRunEnd={row.isRunEnd}
                            isMine={isMine}
                            animate={row.key === animatedKey}
                            sender={isMine ? UNKNOWN_SENDER : (senders.get(message.senderId) ?? UNKNOWN_SENDER)}
                        />
                    );
                })}

                <div className="h-4 md:h-5" />
            </div>
        </div>
    );
}

export default function UserChat() {
    const selectedChat = useChatStore(s => s.selectedChat);
    const { data: authUser } = useCheckSession();
    const { data: people } = useAllUsers();
    const { mutate: markMessageAsRead } = useMarkMessageAsRead();
    const [announcement, setAnnouncement] = useState('');
    const announcedRef = useRef<string | null>(null);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading
    } = useChatMessages(selectedChat?.id || "");

    const messages = useMemo(
        () => data?.pages.flatMap(page => page.messages).reverse() ?? [],
        [data]
    );

    const rows = useMemo(() => buildMessageRows(messages), [messages]);

    const senders = useMemo(
        () => new Map<string, BubbleSender>((people ?? []).map(u => [u.id, { name: u.name, avatar: u.avatar ?? null }])),
        [people]
    );

    const loadMore = useCallback(() => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    useEffect(() => {
        if (isLoading) return;
        if (!messages || !messages.length || !selectedChat?.lastMessage) return;

        const lastMessage = selectedChat.lastMessage;
        const hasUnread = lastMessage.senderId !== authUser?.id && !lastMessage.isRead;

        if (hasUnread) {
            markMessageAsRead(lastMessage.id);
        }
    }, [selectedChat, authUser?.id, markMessageAsRead]);

    useEffect(() => {
        const latest = messages[messages.length - 1];
        if (!latest) return;

        if (announcedRef.current === null) {
            announcedRef.current = latest.id;
            return;
        }
        if (announcedRef.current === latest.id) return;

        announcedRef.current = latest.id;
        if (latest.senderId === authUser?.id) return;

        const sender = people?.find(u => u.id === latest.senderId)?.name ?? 'Someone';
        setAnnouncement(`${sender}: ${latest.content ?? ''}`);
    }, [messages, authUser?.id, people]);

    useEffect(() => {
        announcedRef.current = null;
        setAnnouncement('');
    }, [selectedChat?.id]);

    if (isLoading) return (
        <div className='flex items-center justify-center h-full chat-wall'>
            <ClipLoader color='var(--sc-accent)' size={28} aria-label="Loading conversation" />
        </div>
    );

    if (!selectedChat) return null;

    return (
        <div className='h-full min-h-0 flex flex-col bg-app'>
            <UserChatHeader />

            <div className='flex-1 min-h-0 chat-wall'>
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center px-8">
                        <p className="text-[0.9375rem] text-muted max-w-xs">
                            No messages yet. Say hello to get the conversation started.
                        </p>
                    </div>
                ) : (
                    <MessageList
                        key={selectedChat.id}
                        rows={rows}
                        authUserId={authUser?.id}
                        senders={senders}
                        hasOlder={!!hasNextPage}
                        isFetchingOlder={isFetchingNextPage}
                        loadOlder={loadMore}
                    />
                )}
            </div>

            <p role="log" aria-live="polite" aria-atomic="true" className="sr-only">
                {announcement}
            </p>

            <ChatInput chatId={selectedChat.id} />
        </div>
    )
}
