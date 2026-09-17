import { ClipLoader } from 'react-spinners';
import { NavLink } from 'react-router';
import { signupBodySchema, type SignupBody } from 'super-chat-shared/auth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Input from '../components/ui/input.js';
import { useSignup, useGuestLogin } from './../hooks/use-auth-mutations.js';
import GuestLoginButton from '../components/ui/guest-login-button.js';
import ThemeToggle from '../components/ui/theme-toggle';
import { AxiosError } from 'axios';

export default function Signup() {
    const signup = useSignup();
    const guestLogin = useGuestLogin();
    const { register, handleSubmit, formState, setError } = useForm({
        resolver: zodResolver(signupBodySchema)
    });

    function handleFormSubmit(data: SignupBody) {
        signup.mutate(data, {
            onError: (e) => {
                const message = e instanceof AxiosError
                    ? e.response?.data?.message || 'Could not create your account. Please try again.'
                    : 'Could not create your account. Please try again.';
                setError('root', { message });
            }
        });
    }

    function handleGuestLogin() {
        guestLogin.mutate(undefined, {
            onError: (e) => {
                const message = e instanceof AxiosError
                    ? e.response?.data?.message || 'Could not start a guest session.'
                    : 'Could not start a guest session.';
                setError('root', { message });
            }
        });
    }

    return (
        <div className="relative min-h-dvh flex flex-col items-center justify-center bg-app px-4 py-10">
            <ThemeToggle className="absolute top-4 right-4" />
            <div className="w-full max-w-sm">
                <div className='mb-6'>
                    <h1 className='text-2xl font-semibold text-ink tracking-tight'>Super Chat</h1>
                    <p className='mt-1 text-[0.9375rem] text-muted'>Create an account to start talking.</p>
                </div>

                <div className="bg-surface border border-line rounded-xl p-6">
                    <form noValidate onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                        {formState.errors.root && (
                            <p role="alert" className="text-sm text-danger bg-danger-soft border border-danger/30 rounded-lg px-3 py-2">
                                {formState.errors.root.message}
                            </p>
                        )}

                        <div className="space-y-1.5">
                            <label htmlFor='name' className="block text-sm font-medium text-ink">Name</label>
                            <Input
                                id='name'
                                {...register("name")}
                                type="text"
                                autoComplete="name"
                                placeholder="Jane Cooper"
                                aria-invalid={!!formState.errors.name}
                                aria-describedby={formState.errors.name ? "name-error" : undefined}
                            />
                            {formState.errors.name && (
                                <p id="name-error" className="text-xs text-danger">{formState.errors.name.message}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor='email' className="block text-sm font-medium text-ink">Email</label>
                            <Input
                                id='email'
                                {...register("email")}
                                type="email"
                                autoComplete="email"
                                placeholder="name@company.com"
                                aria-invalid={!!formState.errors.email}
                                aria-describedby={formState.errors.email ? "signup-email-error" : undefined}
                            />
                            {formState.errors.email && (
                                <p id="signup-email-error" className="text-xs text-danger">{formState.errors.email.message}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor='password' className="block text-sm font-medium text-ink">Password</label>
                            <Input
                                id='password'
                                {...register("password")}
                                type="password"
                                autoComplete="new-password"
                                placeholder="••••••••"
                                aria-invalid={!!formState.errors.password}
                                aria-describedby={formState.errors.password ? "signup-password-error" : undefined}
                            />
                            {formState.errors.password && (
                                <p id="signup-password-error" className="text-xs text-danger">{formState.errors.password.message}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={signup.isPending || guestLogin.isPending}
                            className="btn-solid w-full h-11"
                        >
                            {signup.isPending ? <ClipLoader size={18} color="white" aria-label="Creating account" /> : "Create account"}
                        </button>
                    </form>

                    <GuestLoginButton
                        onClick={handleGuestLogin}
                        isPending={guestLogin.isPending}
                        disabled={signup.isPending}
                    />
                </div>

                <p className='mt-5 text-center text-sm text-muted'>
                    Already have an account?{' '}
                    <NavLink className="text-accent font-medium hover:underline underline-offset-2" to='/login'>
                        Sign in
                    </NavLink>
                </p>
            </div>
        </div>
    );
}
