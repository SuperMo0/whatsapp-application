import { ClipLoader } from 'react-spinners';
import { NavLink } from 'react-router';
import { signupBodySchema, type SignupBody } from 'super-chat-shared/auth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Input from '../components/ui/input.js';
import { useSignup, useGuestLogin } from './../hooks/use-auth-mutations.js';
import GuestLoginButton from '../components/ui/guest-login-button.js';
import { AxiosError } from 'axios';

export default function Signup() {

    const signup = useSignup();
    const guestLogin = useGuestLogin();
    const { register, handleSubmit, formState, setError } = useForm({
        resolver: zodResolver(signupBodySchema)
    });

    function handleFormSubmit(data: SignupBody) {
        signup.mutate(data, {
            onError: (e, v, res) => {
                if (e instanceof AxiosError) {
                    const message = e.response?.data?.message || 'An error occurred during Signup.';
                    setError('root', { message });
                }
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
        <div className="min-h-dvh flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
            <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in duration-500">
                <div className='text-center'>
                    <h1 className='text-6xl font-black text-blue tracking-tighter'>Chat.</h1>
                    <p className='text-slate-500 font-medium'>Create an account to start connecting.</p>
                </div>

                <div className="glass-card p-8 rounded-4xl">
                    <form noValidate onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                        <div className="space-y-1">
                            {formState.errors.root && (
                                <div className="text-red-700 p-3 rounded">
                                    {formState.errors.root.message}
                                </div>
                            )}
                            <label htmlFor='name' className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Full Name</label>
                            <Input
                                {...register("name")}
                                type="text"
                                placeholder="John Doe"
                                id='name'
                            />
                            <p className="text-red-500 text-xs">{formState.errors.name?.message}</p>

                        </div>
                        <div className="space-y-1">
                            <label htmlFor='email' className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Email Address</label>
                            <Input
                                {...register("email")}
                                type="email"
                                placeholder="name@email.com"
                                id='email'
                            />
                            <p className="text-red-500 text-xs">{formState.errors.email?.message}</p>
                        </div>
                        <div className="space-y-1">
                            <label htmlFor='password' className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Password</label>
                            <Input
                                {...register("password")}
                                type="password"
                                placeholder="••••••••"
                                id='password'
                            />
                            <p className="text-red-500 text-xs">{formState.errors.password?.message}</p>
                        </div>

                        <button disabled={signup.isPending || guestLogin.isPending} className="btn bg-blue hover:bg-blue-600 border-0 text-white w-full rounded-xl h-12 btn-glow mt-4">
                            {signup.isPending ? <ClipLoader size={20} color="white" /> : "Create Account"}
                        </button>
                    </form>

                    <GuestLoginButton
                        onClick={handleGuestLogin}
                        isPending={guestLogin.isPending}
                        disabled={signup.isPending}
                    />

                    <div className="mt-6 text-center">
                        <p className='text-sm text-slate-500'>
                            Already have an account?
                            <NavLink className="text-blue font-bold ml-1 hover:underline" to='/login'>Log in</NavLink>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}