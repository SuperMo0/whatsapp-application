import { useState, useRef, useEffect, type ChangeEvent } from 'react';
import { MdEmojiEmotions } from "react-icons/md";
import { IoSend } from "react-icons/io5";
import EmojiPicker, { Theme as EmojiTheme } from 'emoji-picker-react';
import { toast } from 'react-toastify';
import { cn } from '../utils/utils';
import { useCreateNewMessage } from '../hooks/use-chat-mutations';
import { useTheme } from '../theme/useTheme';

type ChatInputProps = {
    chatId: string | null;
};

export default function ChatInput({ chatId }: ChatInputProps) {
    const [text, setText] = useState("");
    const [showEmoji, setShowEmoji] = useState(false);
    const { mutate: sendMessage } = useCreateNewMessage();
    const { dark } = useTheme();
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const emojiButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
        }
    }, [text]);

    useEffect(() => {
        if (!showEmoji) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setShowEmoji(false);
                emojiButtonRef.current?.focus();
            }
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [showEmoji]);

    async function handleSendMessage(e?: ChangeEvent<HTMLFormElement>) {
        if (e) e.preventDefault();
        const trimmedText = text.trim();

        if (!trimmedText || !chatId) return;

        setText("");
        setShowEmoji(false);
        sendMessage({ chatId, messageData: { content: trimmedText } }, {
            onError: () => {
                toast.error('Message not sent. Check your connection and try again.');
                setText(trimmedText);
            }
        });
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const canSend = text.trim().length > 0;

    return (
        <div className="relative shrink-0 bg-surface border-t border-line">
            {showEmoji && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowEmoji(false)}
                        aria-hidden="true"
                    />
                    <div className='absolute bottom-full left-2 mb-2 z-50'>
                        <EmojiPicker
                            theme={dark ? EmojiTheme.DARK : EmojiTheme.LIGHT}
                            lazyLoadEmojis
                            onEmojiClick={(e) => setText(prev => prev + e.emoji)}
                        />
                    </div>
                </>
            )}

            <form onSubmit={handleSendMessage} className="flex items-end gap-2 p-2 md:p-3 mx-auto w-full max-w-[56rem]">
                <button
                    ref={emojiButtonRef}
                    type="button"
                    onClick={() => setShowEmoji(v => !v)}
                    aria-label={showEmoji ? "Close emoji picker" : "Open emoji picker"}
                    aria-expanded={showEmoji}
                    className={cn(
                        "shrink-0 p-2 rounded-lg transition-colors",
                        showEmoji ? "bg-accent-soft text-accent" : "text-muted hover:text-ink hover:bg-surface-2"
                    )}
                >
                    <MdEmojiEmotions className='text-xl' aria-hidden="true" />
                </button>

                <label htmlFor="message-input" className="sr-only">Message</label>
                <textarea
                    id="message-input"
                    ref={textareaRef}
                    rows={1}
                    value={text}
                    onKeyDown={handleKeyDown}
                    onChange={(e) => setText(e.target.value)}
                    className="field flex-1 resize-none max-h-[150px] py-2"
                    placeholder="Type a message"
                />

                <button
                    type="submit"
                    disabled={!canSend}
                    aria-label="Send message"
                    className="btn-solid shrink-0 w-10 h-10 rounded-full"
                >
                    <IoSend className='text-base' aria-hidden="true" />
                </button>
            </form>
        </div>
    );
}
