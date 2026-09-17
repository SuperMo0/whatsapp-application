import { DarkMode, LightMode } from '@mui/icons-material';
import { useTheme } from '../../theme/useTheme';
import { cn } from '../../utils/utils';

type ThemeToggleProps = {
    variant?: 'rail' | 'plain';
    className?: string;
};

export default function ThemeToggle({ variant = 'plain', className }: ThemeToggleProps) {
    const { dark, toggleDark } = useTheme();
    const label = dark ? 'Switch to light theme' : 'Switch to dark theme';
    const Icon = dark ? LightMode : DarkMode;

    if (variant === 'rail') {
        return (
            <button
                type="button"
                onClick={toggleDark}
                aria-label={label}
                title={label}
                className={cn(
                    "flex flex-col items-center justify-center gap-1 w-full md:w-16 py-2 md:py-3 rounded-lg text-muted hover:text-ink hover:bg-surface-2 transition-colors",
                    className
                )}
            >
                <Icon sx={{ fontSize: 22 }} aria-hidden="true" />
                <span className="text-[10px] font-medium tracking-wide">Theme</span>
            </button>
        );
    }

    return (
        <button
            type="button"
            onClick={toggleDark}
            aria-label={label}
            title={label}
            className={cn(
                "p-2 rounded-lg text-muted hover:text-ink hover:bg-surface-2 transition-colors",
                className
            )}
        >
            <Icon fontSize="small" aria-hidden="true" />
        </button>
    );
}
