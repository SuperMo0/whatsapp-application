import { NavLink } from "react-router";
import { ClipLoader } from "react-spinners";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { type LoginBody, loginBodySchema } from "super-chat-shared/auth";
import Input from "../components/ui/input";
import { useLogin, useGuestLogin } from "./../hooks/use-auth-mutations";
import GuestLoginButton from "../components/ui/guest-login-button";
import ThemeToggle from '../components/ui/theme-toggle';
import { AxiosError } from "axios";

export default function Login() {
    const login = useLogin();
    const guestLogin = useGuestLogin();

    const { register, handleSubmit, formState, setError } = useForm({
        resolver: zodResolver(loginBodySchema)
    });

    function handleFormSubmit(data: LoginBody) {
        login.mutate(data, {
            onError: (e) => {
                const message = e instanceof AxiosError
                    ? e.response?.data?.message || 'Could not sign in. Please try again.'
                    : 'Could not sign in. Please try again.';
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
                    <p className='mt-1 text-[0.9375rem] text-muted'>Sign in to continue.</p>
                </div>

                <div className="bg-surface border border-line rounded-xl p-6">
                    <form noValidate onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                        {formState.errors.root && (
                            <p role="alert" className="text-sm text-danger bg-danger-soft border border-danger/30 rounded-lg px-3 py-2">
                                {formState.errors.root.message}
                            </p>
                        )}

                        <div className="space-y-1.5">
                            <label htmlFor="email" className="block text-sm font-medium text-ink">Email</label>
                            <Input
                                id="email"
                                {...register("email")}
                                type="email"
                                autoComplete="email"
                                placeholder="name@company.com"
                                aria-invalid={!!formState.errors.email}
                                aria-describedby={formState.errors.email ? "email-error" : undefined}
                            />
                            {formState.errors.email && (
                                <p id="email-error" className="text-xs text-danger">{formState.errors.email.message}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="password" className="block text-sm font-medium text-ink">Password</label>
                            <Input
                                id="password"
                                {...register("password")}
                                type="password"
                                autoComplete="current-password"
                                placeholder="••••••••"
                                aria-invalid={!!formState.errors.password}
                                aria-describedby={formState.errors.password ? "password-error" : undefined}
                            />
                            {formState.errors.password && (
                                <p id="password-error" className="text-xs text-danger">{formState.errors.password.message}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={login.isPending || guestLogin.isPending}
                            className="btn-solid w-full h-11"
                        >
                            {login.isPending ? <ClipLoader size={18} color="white" aria-label="Signing in" /> : "Sign in"}
                        </button>
                    </form>

                    <GuestLoginButton
                        onClick={handleGuestLogin}
                        isPending={guestLogin.isPending}
                        disabled={login.isPending}
                    />
                </div>

                <p className='mt-5 text-center text-sm text-muted'>
                    Don't have an account?{' '}
                    <NavLink className="text-accent font-medium hover:underline underline-offset-2" to='/signup'>
                        Create one
                    </NavLink>
                </p>
            </div>
        </div>
    );
}
