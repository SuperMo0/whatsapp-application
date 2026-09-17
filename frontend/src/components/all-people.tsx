import { useMemo } from 'react'
import UsersList from './users-list'
import { ClipLoader } from "react-spinners";
import { useCheckSession } from '../hooks/use-auth-queries';
import { useAllUsers, useUserFriends } from '../hooks/use-chat-queries';
import { matchesQuery } from '../utils/utils';

export default function AllPeople({ query = '' }: { query?: string }) {
    const { data: authUser } = useCheckSession();
    const { data: users, isLoading } = useAllUsers();
    const { data: friends } = useUserFriends();

    const filteredUsers = useMemo(() => {
        if (!users || !friends) return [];
        return users.filter((u) =>
            !friends.some(f => f.id === u.id) &&
            authUser?.id !== u.id &&
            matchesQuery(u.name, query)
        );
    }, [users, friends, authUser?.id, query]);

    if (isLoading) return (
        <div className='flex items-center justify-center h-full' role="status" aria-live="polite">
            <ClipLoader color='var(--sc-accent)' size={24} aria-label="Finding people" />
        </div>
    );

    return (
        <UsersList
            users={filteredUsers}
            emptyMessage={
                query
                    ? `No one matches “${query}”.`
                    : "You've seen everyone. Check back when new people join."
            }
        />
    );
}
