import { randomBytes, randomInt, randomUUID } from "node:crypto";
import prisma from '../lib/prisma.js';
import { hash, compare } from "../lib/bcrypt.js";
import { safeUserSchema, type LoginBody, type SignupBody } from 'super-chat-shared/auth';
import { AppError } from "@/errors/appError.ts";
import { isUniqueConstraintError } from "@/utils/prismaErrors.util.ts";
import { generateToken } from "../lib/jwt.js";

const GUEST_EMAIL_DOMAIN = "guest.local";

const globalChat = {
    connectOrCreate: {
        create: { id: "1", name: 'global' },
        where: { id: "1" }
    }
};

export const authService = {
    async login(body: LoginBody) {
        const user = await prisma.user.findUnique({
            where: { email: body.email }
        });

        if (!user) {
            throw new AppError(401, "Invalid credentials");
        }

        const isPasswordValid = await compare(body.password, user.password);
        if (!isPasswordValid) {
            throw new AppError(401, "Invalid credentials");
        }

        const safeUser = safeUserSchema.parse(user);
        const token = await generateToken({ id: user.id });

        return { safeUser, token };
    },

    async signup(body: SignupBody) {
        const hashedPassword = await hash(body.password);

        try {
            const user = await prisma.user.create({
                data: {
                    ...body,
                    password: hashedPassword,
                    chats: globalChat
                }
            });

            const safeUser = safeUserSchema.parse(user);
            const token = await generateToken({ id: user.id });

            return { safeUser, token };

        } catch (error) {
            if (isUniqueConstraintError(error)) {
                throw new AppError(409, "Email already exists");
            }
            throw error;
        }
    },

    async guestLogin() {
        const hashedPassword = await hash(randomBytes(32).toString("hex"));

        const user = await prisma.user.create({
            data: {
                email: `guest_${randomUUID()}@${GUEST_EMAIL_DOMAIN}`,
                name: `Guest ${randomInt(1000, 10000)}`,
                password: hashedPassword,
                isGuest: true,
                chats: globalChat
            }
        });

        const safeUser = safeUserSchema.parse(user);
        const token = await generateToken({ id: user.id });

        return { safeUser, token };
    },

    async checkAuth(userId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) return null;

        return safeUserSchema.parse(user);
    }
};
