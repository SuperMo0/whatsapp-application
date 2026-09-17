import ChatsList from '../components/chats-list.js';
import UserChat from '../components/user-chat.js';
import ChatPlaceholder from '../components/ui/chat-placeholder.js';
import { useChatStore } from '../stores/chat.store.js';
import { cn } from '../utils/utils.js';

export default function Chats() {
    const { selectedChat } = useChatStore();

    return (
        <div className='h-full min-h-0 flex flex-col md:grid md:grid-cols-[320px_1fr] lg:grid-cols-[360px_1fr] overflow-hidden'>
            <div className={cn(
                "min-h-0 h-full overflow-hidden bg-surface md:border-r border-line",
                selectedChat ? "hidden md:block" : "block"
            )}>
                <ChatsList />
            </div>

            <div className={cn(
                "min-h-0 h-full overflow-hidden",
                !selectedChat ? "hidden md:flex" : "flex flex-col"
            )}>
                {selectedChat ? <UserChat /> : <ChatPlaceholder />}
            </div>
        </div>
    );
}
