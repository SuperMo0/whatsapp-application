import { useMemo } from 'react';
import UsersList from './users-list'
import { useUserFriends } from '../hooks/use-chat-queries';
import { matchesQuery } from '../utils/utils';

export default function Friends({ query = '' }: { query?: string }) {
    const { data: friends } = useUserFriends();

    const visible = useMemo(
        () => (friends ?? []).filter(f => matchesQuery(f.name, query)),
        [friends, query]
    );

    return (
        <UsersList
            users={visible}
            emptyMessage={
                query
                    ? `No friends match “${query}”.`
                    : 'No friends yet. Open Discover to find people and send a request.'
            }
        />
    );
}
