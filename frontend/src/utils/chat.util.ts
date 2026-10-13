import type { Chat, Message } from 'super-chat-shared/chat'

export function getFriend(userId: string, chat: Chat) {
    return chat.users[0].id != userId ? chat.users[0] : chat.users[1];
}

type ClientKeyed = { clientKey?: string };

// The key a message is rendered under. An optimistic message is swapped for
// the server copy once it is saved; carrying the optimistic id over keeps the
// row mounted instead of remounting (and re-animating) it.
export function messageKey(message: Message): string {
    return (message as Message & ClientKeyed).clientKey ?? message.id;
}

export function withClientKey(message: Message, clientKey: string): Message {
    return Object.assign({}, message, { clientKey });
}

export type MessageRow = {
    key: string;
    message: Message;
    isNewDay: boolean;
    isNewSender: boolean;
    isRunEnd: boolean;
};

// Grouping flags are derived once per data change rather than inside every
// row render, so scrolling only mounts rows and never recomputes them.
export function buildMessageRows(messages: Message[]): MessageRow[] {
    const days = messages.map(m => new Date(m.timestamp).toDateString());

    return messages.map((message, i) => {
        const previous = messages[i - 1];
        const next = messages[i + 1];
        const isNewDay = !previous || days[i - 1] !== days[i];

        return {
            key: messageKey(message),
            message,
            isNewDay,
            isNewSender: !previous || previous.senderId !== message.senderId,
            isRunEnd: !next || next.senderId !== message.senderId || days[i + 1] !== days[i],
        };
    });
}
