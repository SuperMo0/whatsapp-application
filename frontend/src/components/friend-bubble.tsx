import type { Message } from 'super-chat-shared/chat';
import { bubbleTime } from '../utils/Dates.util.js';
import { useAllUsers } from '../hooks/use-chat-queries';
import Avatar from './ui/avatar';
import { cn } from '../utils/utils';

type FriendBubbleProps = {
    message: Message;
    showSender?: boolean;
    showTail?: boolean;
    animate?: boolean;
};

export default function FriendBubble({ message, showSender = true, showTail = true, animate = false }: FriendBubbleProps) {
    const { data: people } = useAllUsers();
    // todo: we can optimize this next line by either embedding the user in every message or passing the user as a prop and using a map.
    const friend = people?.find((user) => user.id === message.senderId) || { name: "Unknown", avatar: null };
    const isGlobal = message.chatId === "1";

    return (
        <div className={cn("flex justify-start gap-2", animate && "message-in")}>
            {isGlobal && (
                <div className="w-7 shrink-0 self-end">
                    {showTail && <Avatar name={friend.name} src={friend.avatar} size={28} />}
                </div>
            )}

            <div className={cn('bubble-base bubble-in', showTail && 'tail-in')}>
                {isGlobal && showSender && (
                    <p className="text-[0.8125rem] font-medium text-muted mb-0.5">{friend.name}</p>
                )}

                <p className="whitespace-pre-wrap">
                    {message.content}
                    <span className="bubble-meta text-[11px] tnum text-muted">
                        {bubbleTime(message.timestamp)}
                    </span>
                </p>
            </div>
        </div>
    )
}
