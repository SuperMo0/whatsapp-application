import { useCheckSession } from '../hooks/use-auth-queries';
import { useUserFriends, useUserFriendsRequestsTo, useUserFriendsRequestsBy, useUserChats } from '../hooks/use-chat-queries';
import { useCreateFriendRequest, useAcceptFriendRequest } from '../hooks/use-chat-mutations';
import { useChatStore } from '../stores/chat.store';
import { useNavigate } from 'react-router';
import { cn } from '../utils/utils';
import type { SafeUser } from 'super-chat-shared/auth';
import Avatar from './ui/avatar';

interface UserCardProps {
    user: SafeUser;
}

export default function UserCard({ user }: UserCardProps) {
    const { data: authUser } = useCheckSession();
    const { data: friends } = useUserFriends();
    const { data: requestsToUser } = useUserFriendsRequestsTo();
    const { data: requestsByUser } = useUserFriendsRequestsBy();
    const { data: chats } = useUserChats();

    const { mutate: sendNewRequest } = useCreateFriendRequest();
    const { mutate: acceptRequest } = useAcceptFriendRequest();

    const { setSelectedChat, onlineUsers } = useChatStore();
    const navigate = useNavigate();

    const isFriend = friends?.some(f => f.id === user.id);
    const incomingRequest = requestsToUser?.find(r => r.senderId === user.id);
    const hasSentRequest = requestsByUser?.some(r => r.receiverId === user.id);
    const isOnline = onlineUsers.includes(user.id);

    let actionTitle = "Add";
    let actionLabel = `Send a friend request to ${user.name}`;
    let isPrimary = true;
    let isActionDisabled = false;
    let onAction = () => sendNewRequest(user.id);

    if (isFriend) {
        actionTitle = "Message";
        actionLabel = `Open your conversation with ${user.name}`;
        onAction = () => {
            const targetChat = chats?.find(c => c.id !== "1" && c.users.some(u => u.id === user.id));
            if (targetChat) {
                setSelectedChat(targetChat);
                navigate('/');
            }
        };
    } else if (incomingRequest) {
        actionTitle = "Accept";
        actionLabel = `Accept the friend request from ${user.name}`;
        onAction = () => acceptRequest(incomingRequest.id);
    } else if (hasSentRequest) {
        actionTitle = "Requested";
        actionLabel = `Friend request already sent to ${user.name}`;
        isPrimary = false;
        isActionDisabled = true;
        onAction = () => { };
    }

    return (
        <li className="flex items-center gap-3 px-4 py-2.5 border-b border-line bg-surface">
            <Avatar name={user.name} src={user.avatar} size={40} online={isOnline} />

            <div className="flex-1 min-w-0">
                <p className="font-medium text-[0.9375rem] text-ink truncate">{user.name}</p>
                <p className="text-xs text-muted">{isOnline ? 'Online' : 'Offline'}</p>
            </div>

            <button
                type="button"
                onClick={onAction}
                disabled={isActionDisabled}
                aria-label={actionLabel}
                className={cn(
                    "shrink-0 h-8 px-3.5 text-sm",
                    isPrimary ? "btn-solid" : "btn-outline-quiet"
                )}
            >
                {actionTitle}
            </button>
        </li>
    );
}
