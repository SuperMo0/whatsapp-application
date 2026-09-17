import { useEffect } from 'react'
import { Outlet } from 'react-router'
import Panel from '../components/panel'
import { useChatStore } from '../stores/chat.store';
import { useUserChats, useUserFriendsRequestsTo } from '../hooks/use-chat-queries';
import { useGlobalSocketListeners } from '../hooks/use-global-socket-listeners';
import { useAllUsers } from './../hooks/use-chat-queries';
import LoadingScreen from './../components/ui/loading-screen';

export default function Home() {
    const { connectSocket, disconnectSocket, onlineUsers } = useChatStore();
    const { isLoading: isGettingChats } = useUserChats();
    const { isLoading: isGettingRequestsToUser } = useUserFriendsRequestsTo();
    const { isLoading: isGettingAllUsers } = useAllUsers();

    useGlobalSocketListeners();

    useEffect(() => {
        connectSocket();
        return () => {
            disconnectSocket();
        };
    }, []);

    if (isGettingChats || !onlineUsers || isGettingRequestsToUser || isGettingAllUsers) {
        return <LoadingScreen />
    }

    return (
        <div className="h-dvh flex flex-col md:flex-row bg-app overflow-hidden">
            <nav
                aria-label="Primary"
                className="order-2 md:order-1 shrink-0 bg-surface border-t md:border-t-0 md:border-r border-line"
            >
                <Panel />
            </nav>

            <main className="order-1 md:order-2 flex-1 min-h-0 min-w-0 overflow-hidden">
                <Outlet />
            </main>
        </div>
    );
}
