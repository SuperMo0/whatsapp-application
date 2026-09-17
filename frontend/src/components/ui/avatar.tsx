import { useState } from 'react';
import { cn } from '../../utils/utils';

const TINTS = ['#5a6b7a', '#6b5f52', '#4f6b5c', '#75604f', '#5c5a72', '#6e5566'];

function tintFor(name: string) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
    return TINTS[hash % TINTS.length];
}

function initialsFor(name: string) {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return '?';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

type AvatarProps = {
    name: string;
    src?: string | null;
    size?: number;
    online?: boolean;
    variant?: 'person' | 'global';
    className?: string;
};

export default function Avatar({
    name,
    src,
    size = 48,
    online,
    variant = 'person',
    className,
}: AvatarProps) {
    const [failed, setFailed] = useState(false);
    const showImage = variant === 'person' && src && !failed;
    const dot = Math.max(10, Math.round(size * 0.26));

    return (
        <div
            className={cn('relative shrink-0', className)}
            style={{ width: size, height: size }}
        >
            {variant === 'global' ? (
                <div
                    className="w-full h-full rounded-full bg-accent-soft text-accent flex items-center justify-center"
                    aria-hidden="true"
                >
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ width: size * 0.56, height: size * 0.56 }}
                    >
                        <circle cx="12" cy="12" r="8.25" />
                        <path d="M3.75 12h16.5" />
                        <path d="M12 3.75c2.1 2.3 3.2 5.2 3.2 8.25S14.1 17.95 12 20.25c-2.1-2.3-3.2-5.2-3.2-8.25S9.9 6.05 12 3.75Z" />
                    </svg>
                </div>
            ) : showImage ? (
                <img
                    src={src!}
                    alt=""
                    draggable={false}
                    onError={() => setFailed(true)}
                    className="w-full h-full rounded-full object-cover bg-surface-2"
                />
            ) : (
                <div
                    className="w-full h-full rounded-full flex items-center justify-center text-white font-semibold select-none"
                    style={{ backgroundColor: tintFor(name), fontSize: Math.round(size * 0.36) }}
                    aria-hidden="true"
                >
                    {initialsFor(name)}
                </div>
            )}

            {online && (
                <>
                    <span
                        className="absolute bottom-0 right-0 rounded-full bg-online ring-2 ring-surface"
                        style={{ width: dot, height: dot }}
                        aria-hidden="true"
                    />
                    <span className="sr-only">Online</span>
                </>
            )}
        </div>
    );
}
