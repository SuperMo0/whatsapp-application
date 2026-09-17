import { useMemo } from 'react';
import UsersList from './users-list';
import { useUserFriendsRequestsTo } from '../hooks/use-chat-queries';
import { matchesQuery } from '../utils/utils';

export default function Requests({ query = '' }: { query?: string }) {
    const { data: requestsToUser } = useUserFriendsRequestsTo();

    const senders = useMemo(
        () => (requestsToUser ?? [])
            .map(r => r.sender!)
            .filter(s => s && matchesQuery(s.name, query)),
        [requestsToUser, query]
    );

    return (
        <UsersList
            users={senders}
            emptyMessage={
                query
                    ? `No requests match “${query}”.`
                    : 'No pending requests. When someone asks to connect, they appear here.'
            }
        />
    );
}
