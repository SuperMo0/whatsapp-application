import { useRef, useCallback, useEffect, useState } from 'react'
import { useChatStore } from '../stores/chat.store.ts'
import UserChatHeader from './user-chat-header.jsx';
import MeBubble from './me-bubble.jsx'
import FriendBubble from './friend-bubble.jsx'
import ChatInput from './chat-input.jsx';
import { useCheckSession } from '../hooks/use-auth-queries.ts';
import { useChatMessages, useAllUsers } from '../hooks/use-chat-queries.ts';
import { useMarkMessageAsRead } from '../hooks/use-chat-mutations.ts';
import { ClipLoader } from 'react-spinners';
import { Virtuoso, type VirtuosoHandle } from 'react-virtuoso';
import { dayLabel } from '../utils/Dates.util.js';

export default function UserChat() {
    const { selectedChat } = useChatStore();
    const { data: authUser } = useCheckSession();
    const { data: people } = useAllUsers();
    const { mutate: markMessageAsRead } = useMarkMessageAsRead();
    const virtuosoRef = useRef<VirtuosoHandle>(null);
    const [announcement, setAnnouncement] = useState('');
    const announcedRef = useRef<string | null>(null);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading
    } = useChatMessages(selectedChat?.id || "");

    const messages = data?.pages.flatMap(page => page.messages).reverse() || [];

    const firstItemIndex = 1000000 - messages.length;
    const loadMore = useCallback(() => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    const scrollToBottom = () => {
        virtuosoRef.current?.scrollToIndex({
            index: 'LAST',
            behavior: 'smooth'
        });
    };

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
                    <Virtuoso
                        ref={virtuosoRef}
                        className="h-full w-full"
                        data={messages}
                        firstItemIndex={firstItemIndex}
                        initialTopMostItemIndex={messages.length - 1}
                        startReached={loadMore}
                        followOutput={(isAtBottom) => (isAtBottom ? 'smooth' : false)}
                        alignToBottom
                        itemContent={(index, message) => {
                            const arrayIndex = index - firstItemIndex;
                            const previous = arrayIndex > 0 ? messages[arrayIndex - 1] : undefined;

                            const next = messages[arrayIndex + 1];

                            const isNewDay = !previous ||
                                new Date(previous.timestamp).toDateString() !== new Date(message.timestamp).toDateString();
                            const isNewSender = !previous || previous.senderId !== message.senderId;
                            const isNextDay = next &&
                                new Date(next.timestamp).toDateString() !== new Date(message.timestamp).toDateString();
                            const isRunEnd = !next || next.senderId !== message.senderId || !!isNextDay;

                            return (
                                <div className="px-3 md:px-6 mx-auto w-full max-w-[56rem]">
                                    {isNewDay && (
                                        <div className="flex justify-center py-3">
                                            <span className="px-2.5 py-1 rounded-md bg-surface border border-line text-[11px] font-medium text-muted">
                                                {dayLabel(message.timestamp)}
                                            </span>
                                        </div>
                                    )}
                                    <div className={isNewSender && !isNewDay ? 'pt-2' : ''}>
                                        {message.senderId === authUser?.id
                                            ? <MeBubble message={message} showTail={isRunEnd} />
                                            : <FriendBubble message={message} showSender={isNewSender} showTail={isRunEnd} />
                                        }
                                    </div>
                                    <div className="h-0.5" />
                                </div>
                            );
                        }}
                        components={{
                            Header: () => isFetchingNextPage ? (
                                <div className='w-full flex justify-center py-4'>
                                    <ClipLoader color='var(--sc-accent)' size={18} aria-label="Loading earlier messages" />
                                </div>
                            ) : null
                        }}
                    />
                )}
            </div>

            <p role="log" aria-live="polite" aria-atomic="true" className="sr-only">
                {announcement}
            </p>

            <ChatInput onSend={scrollToBottom} chatId={selectedChat.id} />
        </div>
    )
}
