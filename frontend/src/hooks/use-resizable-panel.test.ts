import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { useResizablePanel } from './use-resizable-panel';

/** Minimal pointer event stand-in; the hook only reads button, clientX and pointerId. */
function pointer(clientX: number) {
    const target = {
        setPointerCapture: () => { },
        releasePointerCapture: () => { },
        hasPointerCapture: () => true,
    };
    return {
        button: 0,
        clientX,
        pointerId: 1,
        preventDefault: () => { },
        currentTarget: target,
    } as unknown as React.PointerEvent<HTMLDivElement>;
}

function key(k: string) {
    return { key: k, preventDefault: () => { } } as unknown as React.KeyboardEvent<HTMLDivElement>;
}

function drag(result: { current: ReturnType<typeof useResizablePanel> }, from: number, to: number) {
    act(() => { result.current.dividerProps.onPointerDown(pointer(from)); });
    act(() => { result.current.dividerProps.onPointerMove(pointer(to)); });
    act(() => { result.current.dividerProps.onPointerUp(pointer(to)); });
}

beforeEach(() => {
    localStorage.clear();
});

describe('useResizablePanel', () => {
    it('starts at the default width and expanded', () => {
        const { result } = renderHook(() => useResizablePanel());
        expect(result.current.width).toBe(360);
        expect(result.current.collapsed).toBe(false);
    });

    it('resizes by the pointer delta', () => {
        const { result } = renderHook(() => useResizablePanel());
        drag(result, 360, 420);
        expect(result.current.width).toBe(420);
    });

    it('clamps to the maximum width', () => {
        const { result } = renderHook(() => useResizablePanel());
        drag(result, 360, 2000);
        expect(result.current.width).toBe(result.current.bounds.max);
    });

    it('clamps to the minimum rather than going below it', () => {
        const { result } = renderHook(() => useResizablePanel());
        // 230 is under the 260 minimum but still above the collapse threshold.
        drag(result, 360, 230);
        expect(result.current.width).toBe(result.current.bounds.min);
        expect(result.current.collapsed).toBe(false);
    });

    it('collapses when dragged past the collapse threshold', () => {
        const { result } = renderHook(() => useResizablePanel());
        drag(result, 360, 150);
        expect(result.current.collapsed).toBe(true);
    });

    it('keeps the last expanded width after collapsing', () => {
        const { result } = renderHook(() => useResizablePanel());
        drag(result, 360, 420);
        act(() => { result.current.toggleCollapsed(); });
        expect(result.current.collapsed).toBe(true);
        act(() => { result.current.toggleCollapsed(); });
        expect(result.current.width).toBe(420);
    });

    it('reports dragging state only while the pointer is down', () => {
        const { result } = renderHook(() => useResizablePanel());
        expect(result.current.isDragging).toBe(false);
        act(() => { result.current.dividerProps.onPointerDown(pointer(360)); });
        expect(result.current.isDragging).toBe(true);
        act(() => { result.current.dividerProps.onPointerUp(pointer(360)); });
        expect(result.current.isDragging).toBe(false);
    });

    it('ignores non-primary mouse buttons', () => {
        const { result } = renderHook(() => useResizablePanel());
        act(() => {
            result.current.dividerProps.onPointerDown({
                ...pointer(360), button: 2,
            } as unknown as React.PointerEvent<HTMLDivElement>);
        });
        expect(result.current.isDragging).toBe(false);
    });

    describe('keyboard', () => {
        it('resizes with arrow keys', () => {
            const { result } = renderHook(() => useResizablePanel());
            act(() => { result.current.dividerProps.onKeyDown(key('ArrowRight')); });
            expect(result.current.width).toBe(376);
            act(() => { result.current.dividerProps.onKeyDown(key('ArrowLeft')); });
            expect(result.current.width).toBe(360);
        });

        it('collapses on Home and maximises on End', () => {
            const { result } = renderHook(() => useResizablePanel());
            act(() => { result.current.dividerProps.onKeyDown(key('Home')); });
            expect(result.current.collapsed).toBe(true);
            act(() => { result.current.dividerProps.onKeyDown(key('End')); });
            expect(result.current.collapsed).toBe(false);
            expect(result.current.width).toBe(result.current.bounds.max);
        });

        it('toggles on Enter and Space', () => {
            const { result } = renderHook(() => useResizablePanel());
            act(() => { result.current.dividerProps.onKeyDown(key('Enter')); });
            expect(result.current.collapsed).toBe(true);
            act(() => { result.current.dividerProps.onKeyDown(key(' ')); });
            expect(result.current.collapsed).toBe(false);
        });
    });

    describe('persistence', () => {
        it('restores a stored width and collapsed state', () => {
            localStorage.setItem('sc:list-width', '420');
            localStorage.setItem('sc:list-collapsed', 'true');
            const { result } = renderHook(() => useResizablePanel());
            expect(result.current.width).toBe(420);
            expect(result.current.collapsed).toBe(true);
        });

        it('clamps a stored width that is out of range', () => {
            localStorage.setItem('sc:list-width', '9999');
            const { result } = renderHook(() => useResizablePanel());
            expect(result.current.width).toBe(result.current.bounds.max);
        });

        it('falls back to the default when the stored width is not a number', () => {
            localStorage.setItem('sc:list-width', 'not-a-number');
            const { result } = renderHook(() => useResizablePanel());
            expect(result.current.width).toBe(360);
        });

        it('writes changes back to storage', () => {
            const { result } = renderHook(() => useResizablePanel());
            drag(result, 360, 400);
            expect(localStorage.getItem('sc:list-width')).toBe('400');
        });
    });
});
