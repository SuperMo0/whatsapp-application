import { cn } from '../../utils/utils.ts';

export interface TabBtnProps {
    id: string;
    label: string;
    badgeCount?: number;
    isActive: boolean;
    onClick: () => void;
}

export default function TabBtn({ id, label, badgeCount, isActive, onClick }: TabBtnProps) {
    return (
        <button
            type="button"
            role="tab"
            id={`tab-${id}`}
            aria-controls={`panel-${id}`}
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            onClick={onClick}
            className={cn(
                "relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap",
                isActive
                    ? "text-accent border-accent"
                    : "text-muted border-transparent hover:text-ink"
            )}
        >
            {label}
            {badgeCount ? (
                <span className="min-w-5 h-5 px-1.5 rounded-full bg-accent-soft text-accent text-xs font-semibold leading-5 text-center tnum">
                    {badgeCount}
                </span>
            ) : null}
        </button>
    );
}
