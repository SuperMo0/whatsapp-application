import type { SafeUser } from 'super-chat-shared/auth';
import UserCard from './user-card';

type UserListItem = {
    users: SafeUser[];
    emptyMessage?: string;
}

export default function UsersList({ users, emptyMessage }: UserListItem) {
    if (!users || users.length === 0) {
        return (
            <div className="flex items-center justify-center h-full px-8 text-center">
                <p className="text-[0.9375rem] text-muted max-w-xs">
                    {emptyMessage ?? 'Nobody here.'}
                </p>
            </div>
        );
    }

    return (
        <ul className='h-full overflow-y-auto'>
            {users.map((user) => (
                <UserCard key={user.id} user={user} />
            ))}
        </ul>
    );
}
