import { ClipLoader } from "react-spinners";

interface GuestLoginButtonProps {
    onClick: () => void;
    isPending: boolean;
    disabled?: boolean;
}

export default function GuestLoginButton({ onClick, isPending, disabled }: GuestLoginButtonProps) {
    return (
        <>
            <div className="flex items-center gap-3 my-5">
                <span className="h-px flex-1 bg-line" />
                <span className="text-xs text-muted">or</span>
                <span className="h-px flex-1 bg-line" />
            </div>

            <button
                type="button"
                onClick={onClick}
                disabled={disabled || isPending}
                className="btn-outline-quiet w-full h-11"
            >
                {isPending
                    ? <ClipLoader size={18} color="var(--sc-accent)" aria-label="Starting guest session" />
                    : "Continue as guest"}
            </button>

            <p className="text-center text-xs text-muted mt-2">
                No account needed — you'll join the global room straight away.
            </p>
        </>
    );
}
