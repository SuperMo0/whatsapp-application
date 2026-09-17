import { useState, useRef, useEffect, type ChangeEvent } from 'react'
import { useCheckSession } from '../hooks/use-auth-queries';
import { useLogout, useUpdateProfile } from '../hooks/use-auth-mutations';
import Cropper from '../components/cropper';
import { toast } from 'react-toastify';
import { useUserFriends } from '../hooks/use-chat-queries';
import { CameraAlt, Logout } from '@mui/icons-material';
import Avatar from '../components/ui/avatar';

export default function Profile() {
    const { data: authUser } = useCheckSession();
    const { mutate: logout } = useLogout();
    const { mutateAsync: updateProfile } = useUpdateProfile();
    const { data: friends } = useUserFriends();

    const [name, setName] = useState(authUser?.name || '');
    const [image, setImage] = useState<string | null>(null);
    const [modal, setModal] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const cropperCloseRef = useRef<HTMLButtonElement>(null);
    const dialogRef = useRef<HTMLDivElement>(null);
    const photoButtonRef = useRef<HTMLButtonElement>(null);
    const wasModalOpen = useRef(false);

    useEffect(() => {
        if (authUser) setName(authUser.name);
    }, [authUser]);

    useEffect(() => {
        if (!modal) {
            if (wasModalOpen.current) {
                wasModalOpen.current = false;
                photoButtonRef.current?.focus();
            }
            return;
        }
        wasModalOpen.current = true;

        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setModal(false);
                return;
            }
            if (e.key !== 'Tab') return;

            const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            if (!focusables || focusables.length === 0) return;

            const first = focusables[0];
            const last = focusables[focusables.length - 1];

            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        };

        document.addEventListener('keydown', onKey);
        cropperCloseRef.current?.focus();
        return () => document.removeEventListener('keydown', onKey);
    }, [modal]);

    function handleImageUpload(e: ChangeEvent<HTMLInputElement>) {
        if (!e.target.files?.[0]) return;
        if (!e.target.files[0].type.startsWith('image')) {
            toast.error("That file isn't an image. Choose a JPG or PNG.");
            return;
        }
        setImage(URL.createObjectURL(e.target.files[0]));
        setModal(true);
    }

    async function handleSave() {
        if (!name.trim()) {
            toast.error("Your name can't be empty.");
            return;
        }
        setIsSaving(true);
        const toastId = toast.loading('Saving…');

        try {
            let fileToUpload: File | undefined = undefined;
            if (image && (image.startsWith('data:') || image.startsWith('blob:'))) {
                const response = await fetch(image);
                const blob = await response.blob();
                fileToUpload = new File([blob], 'avatar.jpg', { type: blob.type });
            }

            await updateProfile({
                name: name !== authUser?.name ? name : undefined,
                image: fileToUpload
            });

            toast.update(toastId, { render: "Profile saved.", type: "success", isLoading: false, autoClose: 2000 });
        } catch {
            toast.update(toastId, { render: "Couldn't save your profile. Try again.", type: "error", isLoading: false, autoClose: 3000 });
        } finally {
            setIsSaving(false);
        }
    }

    if (!authUser) return null;

    const isDirty = name.trim() !== authUser.name || !!image;

    return (
        <div className='h-full min-h-0 flex flex-col bg-app'>
            <header className='shrink-0 px-4 h-14 flex items-center bg-surface border-b border-line'>
                <h1 className="text-base font-semibold text-ink">Profile</h1>
            </header>

            {modal && (
                <div
                    className='fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4'
                    role="dialog"
                    aria-modal="true"
                    aria-label="Crop your photo"
                >
                    <div ref={dialogRef} className="w-full max-w-lg bg-surface border border-line rounded-xl p-5">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-sm font-semibold text-ink">Crop your photo</h2>
                            <button
                                ref={cropperCloseRef}
                                type="button"
                                onClick={() => setModal(false)}
                                className="text-sm text-muted hover:text-ink transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                        <Cropper image={image} closeModal={(cropped: any) => { setModal(false); setImage(cropped); }} />
                    </div>
                </div>
            )}

            <div className='flex-1 min-h-0 overflow-y-auto'>
                <div className='max-w-lg mx-auto px-4 py-8 space-y-8'>
                    <div className="flex items-center gap-4">
                        <div className='relative'>
                            <Avatar name={authUser.name} src={image || authUser.avatar} size={72} />
                            <button
                                ref={photoButtonRef}
                                type="button"
                                onClick={() => inputRef.current?.click()}
                                aria-label="Change profile photo"
                                className="absolute -bottom-1 -right-1 p-1.5 bg-accent text-accent-ink rounded-full border-2 border-app hover:bg-accent-hover transition-colors"
                            >
                                <CameraAlt sx={{ fontSize: 14 }} aria-hidden="true" />
                            </button>
                            <input hidden ref={inputRef} accept='image/*' onChange={handleImageUpload} type="file" />
                        </div>

                        <div className="min-w-0">
                            <p className="text-lg font-semibold text-ink truncate">{authUser.name}</p>
                            <p className="text-sm text-muted tnum">
                                {friends?.length ?? 0} {friends?.length === 1 ? 'connection' : 'connections'}
                            </p>
                        </div>
                    </div>

                    <div className="bg-surface border border-line rounded-xl p-5 space-y-4">
                        <div className="space-y-1.5">
                            <label htmlFor="display-name" className="block text-sm font-medium text-ink">
                                Display name
                            </label>
                            <input
                                id="display-name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="field"
                            />
                            <p className="text-xs text-muted">This is the name other people see.</p>
                        </div>

                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={isSaving || !isDirty}
                            className="btn-solid w-full h-11"
                        >
                            {isSaving ? 'Saving…' : 'Save changes'}
                        </button>
                    </div>

                    <div className="pt-2">
                        <button
                            type="button"
                            onClick={() => logout()}
                            className="flex items-center gap-2 text-sm font-medium text-danger hover:underline underline-offset-2 transition-colors"
                        >
                            <Logout sx={{ fontSize: 16 }} aria-hidden="true" /> Sign out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
