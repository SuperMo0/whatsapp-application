import { memo } from 'react';
import type { Message } from 'super-chat-shared/chat';
import { bubbleTime } from '../utils/Dates.util.js';
import Avatar from './ui/avatar';
import { cn } from '../utils/utils';

export type BubbleSender = {
    name: string;
    avatar: string | null;
};

type FriendBubbleProps = {
    message: Message;
    sender: BubbleSender;
    showSender?: boolean;
    isRunEnd?: boolean;
    animate?: boolean;
};

function FriendBubble({ message, sender: friend, showSender = true, isRunEnd = true, animate = false }: FriendBubbleProps) {
    const isGlobal = message.chatId === "1";

    return (
        <div className={cn("flex justify-start gap-2", animate && "message-in")}>
            {isGlobal && (
                <div className="w-7 shrink-0 self-end">
                    {isRunEnd && <Avatar name={friend.name} src={friend.avatar} size={28} />}
                </div>
            )}

            <div className="bubble-base bubble-in">
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

export default memo(FriendBubble);
