export const ChatSkeleton = () => (
    <div className="flex gap-3 items-center px-4 py-2.5 animate-pulse" aria-hidden="true">
        <div className="w-11 h-11 bg-surface-3 rounded-full shrink-0" />
        <div className="flex-1 space-y-2">
            <div className="h-3 bg-surface-3 rounded w-1/3" />
            <div className="h-3 bg-surface-3 rounded w-3/4" />
        </div>
    </div>
);
