import { RiChatSmile3Line } from "react-icons/ri";
import { useChatStore } from '../../stores/chat.store';
import { useUserChats } from '../../hooks/use-chat-queries';

export default function ChatPlaceholder() {
    const { setSelectedChat } = useChatStore();
    const { data: chats } = useUserChats();

    const globalChat = chats?.find(c => c.id === "1");

    return (
        <div className='flex-1 h-full flex flex-col items-center justify-center px-8 chat-wall'>
            <div className="max-w-sm text-center">
                <RiChatSmile3Line className='text-4xl text-faint mx-auto mb-4' aria-hidden="true" />
                <h2 className='text-lg font-semibold text-ink'>
                    Super Chat
                </h2>
                <p className='mt-1.5 text-[0.9375rem] text-muted leading-relaxed'>
                    Choose a conversation to start reading, or open Global Community to talk to everyone at once.
                </p>

                {globalChat && (
                    <button
                        type="button"
                        onClick={() => setSelectedChat(globalChat)}
                        className="btn-solid mt-5 h-10 px-5"
                    >
                        Open Global Community
                    </button>
                )}
            </div>
        </div>
    );
}
