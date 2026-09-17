import { Router } from "express";
import * as controller from '@/controllers/auth.controller.ts'
import protect from '@/middlewares/protect.ts'
import { validateBody } from "@/middlewares/validateBody.ts";
import { loginBodySchema, signupBodySchema } from "super-chat-shared/auth";
import { guestLimiter, loginLimiter, signupLimiter } from "@/middlewares/rateLimit.ts";


const router = Router();

router.post('/login',
    loginLimiter,
    validateBody(loginBodySchema),
    controller.login);

router.post('/signup',
    signupLimiter,
    validateBody(signupBodySchema),
    controller.signup);

router.post('/guest',
    guestLimiter,
    controller.guestLogin);

router.post('/logout',
    controller.logout);

router.get('/check',
    protect,
    controller.check);


export default router



