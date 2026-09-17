import type { Message } from 'super-chat-shared/chat';
import { bubbleTime } from '../utils/Dates.util.js';
import { useAllUsers } from '../hooks/use-chat-queries';
import Avatar from './ui/avatar';

type FriendBubbleProps = {
    message: Message;
    showSender?: boolean;
};

export default function FriendBubble({ message, showSender = true }: FriendBubbleProps) {
    const { data: people } = useAllUsers();
    // todo: we can optimize this next line by either embedding the user in every message or passing the user as a prop and using a map.
    const friend = people?.find((user) => user.id === message.senderId) || { name: "Unknown", avatar: null };
    const isGlobal = message.chatId === "1";

    return (
        <div className="flex justify-start gap-2 message-in">
            {isGlobal && (
                <div className="w-7 shrink-0 self-end">
                    {showSender && <Avatar name={friend.name} src={friend.avatar} size={28} />}
                </div>
            )}

            <div className="bubble-base bubble-in">
                {isGlobal && showSender && (
                    <p className="text-[0.8125rem] font-medium text-accent mb-0.5">{friend.name}</p>
                )}

                <p className="whitespace-pre-wrap">
                    {message.content}
                    <span className="bubble-meta text-[10px] tnum text-muted">
                        {bubbleTime(message.timestamp)}
                    </span>
                </p>
            </div>
        </div>
    )
}
