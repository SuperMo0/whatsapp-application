import { describe, expect, it } from 'vitest';
import { createOptimisticMessage } from './optimistic-factory.util';

describe('createOptimisticMessage', () => {
    it('carries the content, sender and chat through', () => {
        const message = createOptimisticMessage('hello', null, 'text', 'user-1', 'chat-1');
        expect(message).toMatchObject({
            content: 'hello',
            type: 'text',
            senderId: 'user-1',
            chatId: 'chat-1',
        });
    });

    it('starts unread, so it does not render a read receipt before the server replies', () => {
        const message = createOptimisticMessage('hello', null, 'text', 'user-1', 'chat-1');
        expect(message.isRead).toBe(false);
        expect(message.readAt).toBeNull();
    });

    it('stamps a timestamp so it sorts to the end of the conversation', () => {
        const before = Date.now();
        const message = createOptimisticMessage('hello', null, 'text', 'user-1', 'chat-1');
        expect(new Date(message.timestamp).getTime()).toBeGreaterThanOrEqual(before);
    });

    it('gives every message a distinct id, so React keys do not collide', () => {
        const ids = new Set(
            Array.from({ length: 50 }, () =>
                createOptimisticMessage('hi', null, 'text', 'user-1', 'chat-1').id)
        );
        expect(ids.size).toBe(50);
    });

    it('accepts a null body for an image-only message', () => {
        const message = createOptimisticMessage(null, 'https://example.test/a.png', 'image', 'u', 'c');
        expect(message.content).toBeNull();
    });
});
