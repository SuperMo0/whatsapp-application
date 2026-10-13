import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useChatStore } from '../stores/chat.store';
import type { Message } from 'super-chat-shared/chat';
import type { GetChatMessagesResponse } from 'super-chat-shared/api';
import { useMarkMessageAsRead } from './use-chat-mutations';
import { messageKey, withClientKey } from '../utils/chat.util';

export const useGlobalSocketListeners = () => {
    const queryClient = useQueryClient();
    const { socket } = useChatStore();
    const { mutate: markMessageAsRead } = useMarkMessageAsRead();

    useEffect(() => {
        if (!socket) return;

        const handleMessageRead = (updatedMessage: Message) => {
            queryClient.setQueryData(['chat', 'messages', updatedMessage.chatId], (oldData: any) => {
                if (!oldData || !oldData.pages) return oldData;

                return {
                    ...oldData,
                    pages: oldData.pages.map((page: GetChatMessagesResponse) => ({
                        ...page,
                        messages: page.messages.map((msg: Message) =>
                            msg.id === updatedMessage.id ? withClientKey(updatedMessage, messageKey(msg)) : msg
                        )
                    }))
                };
            });
        };

        const handleNewMessage = (newMessage: Message) => {
            const currentSelectedChat = useChatStore.getState().selectedChat;

            queryClient.setQueryData(['chat', 'messages', newMessage.chatId], (oldData: any) => {
                if (!oldData || !oldData.pages || oldData.pages.length === 0) return oldData;

                const messageExists = oldData.pages.some((page: any) =>
                    page.messages.some((msg: Message) => msg.id === newMessage.id)
                );

                if (messageExists) {
                    return oldData;
                }

                const newPages = [...oldData.pages];
                newPages[0] = {
                    ...newPages[0],
                    messages: [newMessage, ...newPages[0].messages]
                };

                return {
                    ...oldData,
                    pages: newPages
                };
            });

            if (currentSelectedChat?.id === newMessage.chatId && !newMessage.isRead) {
                setTimeout(() => {
                    markMessageAsRead(newMessage.id);
                }, 50);
            }
        };

        const handleFriendRequestsChange = () => {
            queryClient.invalidateQueries({ queryKey: ['chat', 'requests-to'] });
        };

        const handleFriendsListChange = () => {
            queryClient.invalidateQueries({ queryKey: ['chat', 'friends'] });
        };

        const handleUserChatsChange = () => {
            queryClient.invalidateQueries({ queryKey: ['chat', 'chats'] });
        };

        socket.on('messageIsReadEvent', handleMessageRead);
        socket.on('newMessageEvent', handleNewMessage);
        socket.on('friendRequestsToUserListChangeEvent', handleFriendRequestsChange);
        socket.on('friendsListChangeEvent', handleFriendsListChange);
        socket.on('userChatsChangeEvent', handleUserChatsChange);

        return () => {
            socket.off('messageIsReadEvent', handleMessageRead);
            socket.off('newMessageEvent', handleNewMessage);
            socket.off('friendRequestsToUserListChangeEvent', handleFriendRequestsChange);
            socket.off('friendsListChangeEvent', handleFriendsListChange);
            socket.off('userChatsChangeEvent', handleUserChatsChange);
        };
    }, [socket, queryClient]);
};