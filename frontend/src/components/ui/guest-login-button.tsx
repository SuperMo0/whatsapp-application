import { ClipLoader } from "react-spinners";
import { PersonOutline } from "@mui/icons-material";

interface GuestLoginButtonProps {
    onClick: () => void;
    isPending: boolean;
    disabled?: boolean;
}

export default function GuestLoginButton({ onClick, isPending, disabled }: GuestLoginButtonProps) {
    return (
        <>
            <div className="flex items-center gap-3 my-5">
                <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">or</span>
                <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
            </div>

            <button
                type="button"
                onClick={onClick}
                disabled={disabled || isPending}
                className="btn bg-transparent hover:bg-blue/10 border-2 border-blue/30 hover:border-blue text-blue w-full rounded-xl h-12 font-bold transition-all duration-300 active:scale-95"
            >
                {isPending
                    ? <ClipLoader size={20} color="#3b82f6" />
                    : <><PersonOutline fontSize="small" /> Continue as Guest</>}
            </button>

            <p className="text-center text-xs text-slate-400 mt-2">
                Explore the app instantly — no account needed.
            </p>
        </>
    );
}
