import type { Request, Response } from "express";
import { authService } from "../services/auth.service.js";
import type { LoginBody, SignupBody } from 'super-chat-shared/auth';
import type { GetCheckResponse, PostGuestLoginResponse, PostLoginResponse, PostSignupResponse } from 'super-chat-shared/api';
import { setAuthCookie } from "@/utils/http.util.ts";



type LoginRequest = Request<{}, {}, LoginBody, {}>;
export async function login(req: LoginRequest, res: Response<PostLoginResponse>) {
    const { safeUser, token } = await authService.login(req.body);
    setAuthCookie(res, token);
    res.status(200).json({ user: safeUser });
}


type SignupRequest = Request<{}, {}, SignupBody, {}>;
export async function signup(req: SignupRequest, res: Response<PostSignupResponse>) {
    const { safeUser, token } = await authService.signup(req.body);
    setAuthCookie(res, token);
    res.status(201).json({ user: safeUser });
}

export async function guestLogin(req: Request, res: Response<PostGuestLoginResponse>) {
    const { safeUser, token } = await authService.guestLogin();
    setAuthCookie(res, token);
    res.status(201).json({ user: safeUser });
}

export async function check(req: Request, res: Response<GetCheckResponse>) {
    const userId = res.locals.userId;

    const safeUser = await authService.checkAuth(userId);

    if (!safeUser) {
        res.clearCookie("jwt");
        return res.status(200).json({ user: null });
    }

    return res.status(200).json({ user: safeUser });
}

export async function logout(req: Request, res: Response) {
    res.clearCookie("jwt");
    return res.status(200).json({ user: null });
}