import type { Message } from 'super-chat-shared/chat';
import { bubbleTime, fixDate } from '../utils/Dates.util.js';

export default function MeBubble({ message }: { message: Message }) {
    const isGlobal = message.chatId === "1";
    const readLabel = message.isRead ? `Read ${fixDate(message.readAt!)}` : 'Delivered';

    return (
        <div className="flex justify-end message-in">
            <div className="bubble-base bubble-out">
                <p className="whitespace-pre-wrap">
                    {message.content}
                    <span className="bubble-meta text-[10px] tnum opacity-75">
                        {bubbleTime(message.timestamp)}
                        {!isGlobal && (
                            <>
                                <svg
                                    viewBox="0 0 20 12"
                                    className="w-4 h-3 shrink-0"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    aria-hidden="true"
                                    style={{ opacity: message.isRead ? 1 : 0.65 }}
                                >
                                    <path d="M1.5 6.5 4.5 9.5 10.5 3" />
                                    {message.isRead && <path d="M8.5 6.5 11.5 9.5 18 3" />}
                                </svg>
                                <span className="sr-only">{readLabel}</span>
                            </>
                        )}
                    </span>
                </p>
            </div>
        </div>
    )
}
