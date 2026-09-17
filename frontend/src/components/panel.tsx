import { NavLink } from 'react-router'
import { RiChatSmile3Fill } from "react-icons/ri";
import { MdPeopleAlt } from "react-icons/md";
import { BiSolidUser } from "react-icons/bi";
import { useCheckSession } from '../hooks/use-auth-queries';
import { useUserChats, useUserFriendsRequestsTo } from '../hooks/use-chat-queries';
import { cn } from '../utils/utils';
import ThemeToggle from './ui/theme-toggle';

type NavItemProps = {
    to: string;
    icon: React.ElementType;
    label: string;
    badge: number;
};

function NavItem({ to, icon: Icon, label, badge }: NavItemProps) {
    return (
        <NavLink
            to={to}
            end={to === '/'}
            className={({ isActive }) => cn(
                "relative flex flex-col items-center justify-center gap-1 w-full md:w-16 py-2 md:py-3 rounded-lg transition-colors",
                isActive
                    ? "text-accent bg-accent-soft"
                    : "text-muted hover:text-ink hover:bg-surface-2"
            )}
        >
            <span className="relative">
                <Icon className="text-2xl" aria-hidden="true" />
                {badge > 0 && (
                    <span className="absolute -top-1.5 -right-2 min-w-4 h-4 px-1 rounded-full bg-accent text-accent-ink text-[10px] font-semibold leading-4 text-center tnum">
                        {badge > 99 ? '99+' : badge}
                    </span>
                )}
            </span>
            <span className="text-[10px] font-medium tracking-wide">{label}</span>
            {badge > 0 && <span className="sr-only">{badge} unread</span>}
        </NavLink>
    );
}

export default function Panel() {
    const { data: chats } = useUserChats();
    const { data: requestsToUser } = useUserFriendsRequestsTo();
    const { data: authUser } = useCheckSession();

    const unreadChats = chats?.filter(c =>
        c.lastMessage && c.lastMessage.senderId !== authUser?.id && !c.lastMessage.isRead
    ).length || 0;

    const unreadRequests = requestsToUser?.length || 0;

    return (
        <div className='flex flex-row md:flex-col gap-1 p-1.5 md:py-3 md:h-full'>
            <NavItem to="/" icon={RiChatSmile3Fill} label="Chats" badge={unreadChats} />
            <NavItem to="/people" icon={MdPeopleAlt} label="People" badge={unreadRequests} />
            <NavItem to="/profile" icon={BiSolidUser} label="Profile" badge={0} />
            <ThemeToggle variant="rail" className="md:mt-auto" />
        </div>
    );
}
