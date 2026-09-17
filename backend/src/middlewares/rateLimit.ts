import { rateLimit, type Options } from "express-rate-limit";

const baseOptions: Partial<Options> = {
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    ipv6Subnet: 56
};

export const guestLimiter = rateLimit({
    ...baseOptions,
    windowMs: 60 * 60 * 1000,
    limit: 20,
    message: { message: "Too many guest sessions started from this network. Please try again later." }
});

export const signupLimiter = rateLimit({
    ...baseOptions,
    windowMs: 60 * 60 * 1000,
    limit: 10,
    message: { message: "Too many accounts created from this network. Please try again later." }
});

export const loginLimiter = rateLimit({
    ...baseOptions,
    windowMs: 15 * 60 * 1000,
    limit: 20,
    skipSuccessfulRequests: true,
    message: { message: "Too many failed login attempts. Please try again later." }
});
