import { useState } from 'react'
import SearchInput from '../components/search-input.jsx'
import AllPeople from '../components/all-people.jsx'
import Friends from '../components/friends.jsx'
import { ClipLoader } from "react-spinners";
import Requests from '../components/requests.jsx'
import { useUserFriends, useUserFriendsRequestsTo, useUserFriendsRequestsBy } from '../hooks/use-chat-queries.ts';
import TabBtn from '../components/ui/tab-btn.tsx';

export default function People() {
    const [tab, setTab] = useState('friends');
    const [query, setQuery] = useState('');

    const { isLoading: isLoadingFriends } = useUserFriends();
    const { data: requestsToUser, isLoading: isLoadingReqTo } = useUserFriendsRequestsTo();
    const { isLoading: isLoadingReqBy } = useUserFriendsRequestsBy();

    if (isLoadingFriends || isLoadingReqTo || isLoadingReqBy) return (
        <div className='flex items-center justify-center h-full bg-app' role="status" aria-live="polite">
            <ClipLoader color='var(--sc-accent)' size={28} aria-label="Loading people" />
        </div>
    );

    return (
        <div className='h-full min-h-0 flex flex-col bg-app'>
            <header className='shrink-0 bg-surface border-b border-line'>
                <div className="px-4 h-14 flex items-center">
                    <h1 className="text-base font-semibold text-ink">People</h1>
                </div>

                <div className="px-4 pb-3">
                    <SearchInput value={query} onChange={setQuery} />
                </div>

                <div className="flex px-2 overflow-x-auto no-scrollbar" role="tablist" aria-label="People">
                    <TabBtn isActive={tab === 'friends'} onClick={() => setTab('friends')} label="Friends" />
                    <TabBtn isActive={tab === 'all people'} onClick={() => setTab('all people')} label="Discover" />
                    <TabBtn
                        isActive={tab === 'requests'}
                        onClick={() => setTab('requests')}
                        label="Requests"
                        badgeCount={requestsToUser?.length || 0}
                    />
                </div>
            </header>

            <div className="flex-1 min-h-0 overflow-hidden">
                {tab === "friends" && <Friends query={query} />}
                {tab === "all people" && <AllPeople query={query} />}
                {tab === "requests" && <Requests query={query} />}
            </div>
        </div>
    )
}
