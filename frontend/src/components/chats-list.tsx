import { useChatStore } from '../stores/chat.store.js'
import { cn } from '../utils/utils.js';
import { getFriend } from '../utils/chat.util';
import { useCheckSession } from '../hooks/use-auth-queries.ts';
import { useUserChats } from '../hooks/use-chat-queries.ts';
import { useMarkMessageAsRead } from '../hooks/use-chat-mutations.ts';
import { ChatSkeleton } from './ui/chat-skeleton.tsx';
import Avatar from './ui/avatar.tsx';
import { listTime } from '../utils/Dates.util.js';

export default function ChatsList() {
    const { setSelectedChat, selectedChat, onlineUsers } = useChatStore();
    const { data: authUser } = useCheckSession();
    const { data: chats, isLoading: isGettingChats } = useUserChats();
    const { mutate: markMessageAsRead } = useMarkMessageAsRead();

    if (isGettingChats) {
        return (
            <div className="h-full flex flex-col">
                <header className="px-4 h-14 flex items-center border-b border-line">
                    <h1 className="text-base font-semibold text-ink">Chats</h1>
                </header>
                <div className="p-2">{[1, 2, 3, 4, 5].map(i => <ChatSkeleton key={i} />)}</div>
            </div>
        );
    }

    if (!authUser) return null;

    return (
        <div className='h-full flex flex-col'>
            <header className="px-4 h-14 shrink-0 flex items-center border-b border-line">
                <h1 className="text-base font-semibold text-ink">Chats</h1>
            </header>

            <ul className='flex-1 min-h-0 overflow-y-auto'>
                {chats?.map((chat) => {
                    const isGlobal = chat.id === "1";
                    const friend = isGlobal ? null : getFriend(authUser.id, chat);
                    const lastMsg = chat.lastMessage;
                    const isUnread = !!lastMsg && lastMsg.senderId !== authUser.id && !lastMsg.isRead;
                    const isActive = selectedChat?.id === chat.id;
                    const name = isGlobal ? "Global Community" : (friend?.name ?? "Unknown");
                    const isOnline = isGlobal ? true : !!friend && onlineUsers.includes(friend.id);

                    return (
                        <li key={chat.id}>
                            <button
                                type="button"
                                aria-current={isActive ? 'true' : undefined}
                                onClick={() => {
                                    if (isUnread) markMessageAsRead(lastMsg.id);
                                    setSelectedChat(chat);
                                }}
                                className={cn(
                                    'w-full text-left flex gap-3 items-center px-4 py-2.5 border-b border-line transition-colors',
                                    isActive ? 'bg-accent-soft' : 'hover:bg-surface-2'
                                )}
                            >
                                <Avatar
                                    name={name}
                                    src={friend?.avatar}
                                    size={44}
                                    online={isGlobal ? undefined : isOnline}
                                    variant={isGlobal ? 'global' : 'person'}
                                />

                                <span className="flex-1 min-w-0">
                                    <span className="flex justify-between items-baseline gap-2">
                                        <span className="font-medium text-[0.9375rem] text-ink truncate">{name}</span>
                                        {lastMsg && (
                                            <time
                                                dateTime={new Date(lastMsg.timestamp).toISOString()}
                                                className="text-[11px] text-muted tnum shrink-0"
                                            >
                                                {listTime(lastMsg.timestamp)}
                                            </time>
                                        )}
                                    </span>
                                    <span className="flex items-center gap-2 mt-0.5">
                                        <span className={cn(
                                            "text-[0.8125rem] truncate flex-1",
                                            isUnread ? "text-ink font-medium" : "text-muted"
                                        )}>
                                            {lastMsg?.content ?? "No messages yet"}
                                        </span>
                                        {isUnread && (
                                            <>
                                                <span className="w-2 h-2 rounded-full bg-accent shrink-0" aria-hidden="true" />
                                                <span className="sr-only">Unread</span>
                                            </>
                                        )}
                                    </span>
                                </span>
                            </button>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
