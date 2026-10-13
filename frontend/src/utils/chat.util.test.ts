import { describe, expect, it } from 'vitest';
import { buildMessageRows, getFriend, messageKey, withClientKey } from './chat.util';
import type { Chat, Message } from 'super-chat-shared/chat';

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

function msg(id: string, senderId: string, timestamp: string, extra: Record<string, unknown> = {}) {
    return { id, senderId, timestamp, chatId: 'chat-1', content: id, type: 'TEXT', isRead: false, readAt: null, ...extra } as unknown as Message;
}

describe('messageKey', () => {
    it('uses the message id by default', () => {
        expect(messageKey(msg('a', 'me', '2026-01-01T10:00:00'))).toBe('a');
    });

    it('keeps the optimistic key after the server copy replaces it', () => {
        const saved = withClientKey(msg('server-id', 'me', '2026-01-01T10:00:00'), 'temp-id');
        expect(saved.id).toBe('server-id');
        expect(messageKey(saved)).toBe('temp-id');
    });
});

describe('buildMessageRows', () => {
    it('marks day breaks, sender changes and run ends', () => {
        const rows = buildMessageRows([
            msg('1', 'a', '2026-01-01T10:00:00'),
            msg('2', 'a', '2026-01-01T10:01:00'),
            msg('3', 'b', '2026-01-01T10:02:00'),
            msg('4', 'b', '2026-01-02T09:00:00'),
        ]);

        expect(rows.map(r => r.isNewDay)).toEqual([true, false, false, true]);
        expect(rows.map(r => r.isNewSender)).toEqual([true, false, true, false]);
        expect(rows.map(r => r.isRunEnd)).toEqual([false, true, true, true]);
        expect(rows.map(r => r.key)).toEqual(['1', '2', '3', '4']);
    });
});
