import { describe, expect, it } from 'vitest';
import { getFriend } from './chat.util';
import type { Chat } from 'super-chat-shared/chat';

function chatWith(users: Array<{ id: string; name: string; avatar: string | null }>) {
    return { id: 'chat-1', users } as unknown as Chat;
}

describe('getFriend', () => {
    const me = { id: 'me', name: 'Me', avatar: null };
    const them = { id: 'them', name: 'Them', avatar: null };

    it('returns the other participant when I am first', () => {
        expect(getFriend('me', chatWith([me, them]))).toBe(them);
    });

    it('returns the other participant when I am second', () => {
        expect(getFriend('me', chatWith([them, me]))).toBe(them);
    });

    it('does not depend on participant order', () => {
        expect(getFriend('me', chatWith([me, them]))).toEqual(
            getFriend('me', chatWith([them, me]))
        );
    });
});
