import { vi } from 'vitest';
import type { NextFunction, Request, Response } from 'express';

/** A Response test double that records what a handler did to it. */
export function mockResponse() {
    const res = {
        statusCode: undefined as number | undefined,
        body: undefined as unknown,
        ended: false,
        cookies: [] as Array<{ name: string; value: string; options: Record<string, unknown> }>,
        status: vi.fn(function (this: typeof res, code: number) {
            this.statusCode = code;
            return this;
        }),
        json: vi.fn(function (this: typeof res, payload: unknown) {
            this.body = payload;
            return this;
        }),
        end: vi.fn(function (this: typeof res) {
            this.ended = true;
            return this;
        }),
        cookie: vi.fn(function (this: typeof res, name: string, value: string, options: Record<string, unknown>) {
            this.cookies.push({ name, value, options });
            return this;
        }),
    };
    return res as typeof res & Response;
}

export function mockRequest(overrides: Partial<Request> = {}) {
    return { body: {}, params: {}, query: {}, headers: {}, ...overrides } as Request;
}

export function mockNext() {
    return vi.fn() as unknown as NextFunction & ReturnType<typeof vi.fn>;
}
