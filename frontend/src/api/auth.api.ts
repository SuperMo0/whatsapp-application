import client from '../lib/axios';
import type { LoginBody, SignupBody } from 'super-chat-shared/auth';
import type { GetCheckResponse, PostGuestLoginResponse, PostLoginResponse, PostSignupResponse } from 'super-chat-shared/api';
import { catchAsync } from '../utils/catch-async.util';



export const checkSession = async () => {
    const [error, data] = await catchAsync(client.get<GetCheckResponse>('/auth/check'));
    if (error?.status == 401) return { user: null };
    else if (error) throw error;
    return data;
}

export const login = async (loginFromData: LoginBody) => {
    const [error, data] = await catchAsync(client.post<PostLoginResponse>('/auth/login', loginFromData))
    if (error) throw error;
    return data;
}

export const signup = async (signupFormData: SignupBody) => {
    const [error, data] = await catchAsync(client.post<PostSignupResponse>('/auth/signup', signupFormData));
    if (error) throw error;
    return data;
}

export const guestLogin = async () => {
    const [error, data] = await catchAsync(client.post<PostGuestLoginResponse>('/auth/guest'));
    if (error) throw error;
    return data;
}

export const logout = async () => {
    const [error, data] = await catchAsync(client.post<GetCheckResponse>('/auth/logout'));
    if (error) throw error;
    return data;
}