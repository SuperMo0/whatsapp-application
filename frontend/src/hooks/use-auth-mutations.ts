import { useMutation, useQueryClient } from '@tanstack/react-query';
import { login, signup, guestLogin, logout } from '../api/auth.api';
import { orchesterateProfileUpadate, type UpdateProfileBodyClient } from '../api/chat.api';

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: UpdateProfileBodyClient) => orchesterateProfileUpadate(data),
        onSuccess: (data) => {
            queryClient.setQueryData(['auth', 'session'], data);
        },
    });
};

export const useLogin = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: login,
        onSuccess: (data) => {
            queryClient.setQueryData(['auth', 'session'], data);
        },
    });
};

export const useSignup = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: signup,
        onSuccess: (data) => {
            queryClient.setQueryData(['auth', 'session'], data);
        },
    });
};

export const useGuestLogin = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: guestLogin,
        onSuccess: (data) => {
            queryClient.setQueryData(['auth', 'session'], data);
        },
    });
};

export const useLogout = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: logout,
        onSuccess: (data) => {
            queryClient.setQueryData(['auth', 'session'], data);
        },
    });
};