import { useCallback, useEffect, useRef, useState } from 'react';

const MIN_WIDTH = 260;
const MAX_WIDTH = 560;
const DEFAULT_WIDTH = 360;
const COLLAPSE_BELOW = 200;
const STEP = 16;

const WIDTH_KEY = 'sc:list-width';
const COLLAPSED_KEY = 'sc:list-collapsed';

function readStored<T>(key: string, fallback: T, parse: (raw: string) => T): T {
    try {
        const raw = localStorage.getItem(key);
        return raw === null ? fallback : parse(raw);
    } catch {
        return fallback;
    }
}

function store(key: string, value: string) {
    try {
        localStorage.setItem(key, value);
    } catch {
        /* private mode or blocked storage: the panel still works, it just will not persist */
    }
}

export function useResizablePanel() {
    const [width, setWidth] = useState(() =>
        readStored(WIDTH_KEY, DEFAULT_WIDTH, raw => {
            const n = Number(raw);
            return Number.isFinite(n) ? Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, n)) : DEFAULT_WIDTH;
        })
    );
    const [collapsed, setCollapsed] = useState(() =>
        readStored(COLLAPSED_KEY, false, raw => raw === 'true')
    );
    const [isDragging, setIsDragging] = useState(false);

    const dragState = useRef<{ startX: number; startWidth: number } | null>(null);

    useEffect(() => { store(WIDTH_KEY, String(width)); }, [width]);
    useEffect(() => { store(COLLAPSED_KEY, String(collapsed)); }, [collapsed]);

    const applyWidth = useCallback((next: number) => {
        if (next < COLLAPSE_BELOW) {
            setCollapsed(true);
            return;
        }
        setCollapsed(false);
        setWidth(Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, next)));
    }, []);

    const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
        if (e.button !== 0) return;
        e.preventDefault();
        e.currentTarget.setPointerCapture(e.pointerId);
        dragState.current = { startX: e.clientX, startWidth: collapsed ? 0 : width };
        setIsDragging(true);
    }, [collapsed, width]);

    const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
        if (!dragState.current) return;
        applyWidth(dragState.current.startWidth + (e.clientX - dragState.current.startX));
    }, [applyWidth]);

    const endDrag = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
        if (!dragState.current) return;
        dragState.current = null;
        setIsDragging(false);
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
            e.currentTarget.releasePointerCapture(e.pointerId);
        }
    }, []);

    const toggleCollapsed = useCallback(() => setCollapsed(c => !c), []);

    const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
        switch (e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                applyWidth((collapsed ? 0 : width) - STEP);
                break;
            case 'ArrowRight':
                e.preventDefault();
                applyWidth((collapsed ? MIN_WIDTH : width) + STEP);
                break;
            case 'Home':
                e.preventDefault();
                setCollapsed(true);
                break;
            case 'End':
                e.preventDefault();
                setCollapsed(false);
                setWidth(MAX_WIDTH);
                break;
            case 'Enter':
            case ' ':
                e.preventDefault();
                toggleCollapsed();
                break;
        }
    }, [applyWidth, collapsed, width, toggleCollapsed]);

    // While dragging, stop the pointer selecting text across the whole app.
    useEffect(() => {
        if (!isDragging) return;
        const previous = document.body.style.userSelect;
        document.body.style.userSelect = 'none';
        document.body.style.cursor = 'col-resize';
        return () => {
            document.body.style.userSelect = previous;
            document.body.style.cursor = '';
        };
    }, [isDragging]);

    return {
        width,
        collapsed,
        isDragging,
        toggleCollapsed,
        dividerProps: {
            onPointerDown,
            onPointerMove,
            onPointerUp: endDrag,
            onPointerCancel: endDrag,
            onKeyDown,
            onDoubleClick: toggleCollapsed,
        },
        bounds: { min: MIN_WIDTH, max: MAX_WIDTH },
    };
}
