import { useChatStore } from '../stores/chat.store.ts'
import { MdKeyboardArrowLeft } from "react-icons/md";
import { useCheckSession } from '../hooks/use-auth-queries.ts';
import Avatar from './ui/avatar.tsx';

export default function UserChatHeader() {
    const { setSelectedChat, selectedChat, onlineUsers } = useChatStore();
    const { data: authUser } = useCheckSession();

    const isGlobalChat = selectedChat?.id === "1";
    const selectedFriend = isGlobalChat
        ? null
        : selectedChat?.users?.find(u => u.id !== authUser?.id);

    const isOnline = isGlobalChat ? true : (selectedFriend ? onlineUsers.includes(selectedFriend.id) : false);

    const displayName = isGlobalChat ? "Global Community" : (selectedFriend?.name ?? "Unknown");
    const displayStatus = isGlobalChat ? "Open to everyone" : (isOnline ? "Online" : "Offline");

    return (
        <header className='shrink-0 flex gap-3 items-center px-3 md:px-4 h-14 bg-surface border-b border-line'>
            <button
                type="button"
                onClick={() => setSelectedChat(null)}
                aria-label="Back to conversations"
                className='md:hidden -ml-1 p-1 rounded-lg text-muted hover:text-ink hover:bg-surface-2 transition-colors'
            >
                <MdKeyboardArrowLeft className='text-2xl' aria-hidden="true" />
            </button>

            <Avatar
                name={displayName}
                src={selectedFriend?.avatar}
                size={36}
                variant={isGlobalChat ? 'global' : 'person'}
            />

            <div className="flex-1 min-w-0">
                <p className='font-medium text-[0.9375rem] text-ink truncate leading-tight'>
                    {displayName}
                </p>
                <p className='text-xs text-muted leading-tight'>
                    {displayStatus}
                </p>
            </div>
        </header>
    )
}
