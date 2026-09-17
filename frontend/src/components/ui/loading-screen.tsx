import { ClipLoader } from 'react-spinners';

export default function LoadingScreen() {
    return (
        <div
            className='flex flex-col items-center justify-center h-dvh bg-app gap-3'
            role="status"
            aria-live="polite"
        >
            <ClipLoader color='var(--sc-accent)' size={28} />
            <p className="text-sm text-muted">Connecting…</p>
        </div>
    );
}
