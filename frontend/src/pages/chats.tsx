import ChatsList from '../components/chats-list.js';
import UserChat from '../components/user-chat.js';
import ChatPlaceholder from '../components/ui/chat-placeholder.js';
import PanelDivider from '../components/ui/panel-divider.js';
import { useChatStore } from '../stores/chat.store.js';
import { useResizablePanel } from '../hooks/use-resizable-panel.js';
import { cn } from '../utils/utils.js';

export default function Chats() {
    const { selectedChat } = useChatStore();
    const { width, collapsed, isDragging, toggleCollapsed, dividerProps, bounds } = useResizablePanel();

    return (
        <div
            className='h-full min-h-0 flex flex-col md:flex-row overflow-hidden'
            style={{ ['--list-w' as string]: collapsed ? '0px' : `${width}px` }}
        >
            <div className={cn(
                "min-h-0 h-full overflow-hidden bg-surface w-full md:w-[var(--list-w)] md:shrink-0",
                selectedChat ? "hidden md:block" : "block",
                collapsed && "md:hidden"
            )}>
                <ChatsList />
            </div>

            <PanelDivider
                width={width}
                collapsed={collapsed}
                isDragging={isDragging}
                max={bounds.max}
                onExpand={toggleCollapsed}
                dividerProps={dividerProps}
            />

            <div className={cn(
                "min-h-0 h-full flex-1 min-w-0 overflow-hidden",
                !selectedChat ? "hidden md:flex" : "flex flex-col"
            )}>
                {selectedChat ? <UserChat /> : <ChatPlaceholder />}
            </div>
        </div>
    );
}
