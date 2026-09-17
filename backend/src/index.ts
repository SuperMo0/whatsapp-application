import "dotenv/config";
import express from 'express'
import authRouter from './routes/auth.router.js'
import chatRouter from './routes/chat.router.js'
import userRouter from './routes/user.router.js'
import cookieParser from 'cookie-parser';
import cors from 'cors'
import { app, server, io } from './lib/socket.js'
import { errorHandler } from '@/errors/errorHandler.ts'
import { notFound } from "./errors/notFound.ts";
import path from "path";
import type { GetSignUploadSignutureResponse } from "super-chat-shared/api";
import { protect } from "./middlewares/protect.ts";
import type { Response, Request } from "express";
import { signuploadform } from "./utils/signUpload.util.ts";

if (process.env.NODE_ENV === "development") {
    app.use(cors({
        origin: "http://localhost:5173",
        credentials: true,
    }))
}

const trustProxy = process.env.TRUST_PROXY;
if (trustProxy) {
    const hops = Number(trustProxy);
    app.set('trust proxy', Number.isNaN(hops) ? trustProxy : hops);
} else if (process.env.NODE_ENV === 'production') {
    console.warn('TRUST_PROXY is not set. If this app runs behind a proxy, set it to the number of proxy hops so rate limiting keys on the real client IP.');
}

app.set('io', io);

app.use(cookieParser());

app.use(express.json());

app.use('/api/auth', authRouter);

app.use('/api/chat', chatRouter);

app.use('/api/user', userRouter);

app.get('/api/signupload', protect, function (req: Request, res: Response<GetSignUploadSignutureResponse>) {
    const sig = signuploadform()
    res.json({
        signature: sig.signature,
        timestamp: sig.timestamp,
        cloudname: process.env.CLOUDINARY_CLOUD_NAME!,
        apikey: process.env.CLOUDINARY_API_KEY!
    })
})

app.use('/api/{*splat}', notFound);

if (process.env.NODE_ENV == "production") {
    const dist = path.join(process.cwd(), '/../frontend/dist');
    app.use(express.static(dist));
    app.get('/{*splat}', (req, res) => {
        res.sendFile(path.join(dist, '/index.html'));
    })
}

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`server is listening on port:${PORT}`);
})
