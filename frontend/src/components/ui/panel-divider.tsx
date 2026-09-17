import { MdKeyboardArrowRight } from "react-icons/md";

type PanelDividerProps = {
    width: number;
    collapsed: boolean;
    isDragging: boolean;
    max: number;
    onExpand: () => void;
    dividerProps: React.HTMLAttributes<HTMLDivElement>;
};

export default function PanelDivider({
    width, collapsed, isDragging, max, onExpand, dividerProps,
}: PanelDividerProps) {
    return (
        <div className="relative z-20 hidden md:block shrink-0">
            <div
                {...dividerProps}
                role="separator"
                aria-orientation="vertical"
                aria-label="Resize the conversation list"
                aria-valuenow={collapsed ? 0 : width}
                aria-valuemin={0}
                aria-valuemax={max}
                tabIndex={0}
                data-dragging={isDragging ? 'true' : undefined}
                className="panel-divider h-full"
            />

            {collapsed && (
                <button
                    type="button"
                    onClick={onExpand}
                    aria-label="Show the conversation list"
                    className="absolute z-20 top-1/2 left-full -translate-y-1/2 ml-1 p-1 rounded-md bg-surface border border-line text-muted hover:text-ink transition-colors"
                >
                    <MdKeyboardArrowRight className="text-lg" aria-hidden="true" />
                </button>
            )}
        </div>
    );
}
