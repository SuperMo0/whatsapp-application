import { describe, expect, it } from 'vitest';
import { isUniqueConstraintError } from './prismaErrors.util.ts';
import { setAuthCookie } from './http.util.ts';
import { mockResponse } from '../test/express-mocks.ts';

describe('isUniqueConstraintError', () => {
    it('recognises Prisma P2002', () => {
        expect(isUniqueConstraintError({ code: 'P2002' })).toBe(true);
    });

    it('rejects other Prisma codes', () => {
        expect(isUniqueConstraintError({ code: 'P2025' })).toBe(false);
    });

    it('is safe on null, undefined and primitives', () => {
        expect(isUniqueConstraintError(null)).toBe(false);
        expect(isUniqueConstraintError(undefined)).toBe(false);
        expect(isUniqueConstraintError('P2002')).toBe(false);
        expect(isUniqueConstraintError(new Error('boom'))).toBe(false);
    });
});

describe('setAuthCookie', () => {
    it('sets an httpOnly, sameSite-strict jwt cookie', () => {
        const res = mockResponse();
        setAuthCookie(res, 'a.b.c');

        expect(res.cookies).toHaveLength(1);
        const cookie = res.cookies[0]!;
        expect(cookie.name).toBe('jwt');
        expect(cookie.value).toBe('a.b.c');
        expect(cookie.options.httpOnly).toBe(true);
        expect(cookie.options.sameSite).toBe('strict');
    });

    it('expires in two days', () => {
        const res = mockResponse();
        setAuthCookie(res, 'token');
        expect(res.cookies[0]!.options.maxAge).toBe(2 * 24 * 60 * 60 * 1000);
    });

    it('is not marked secure outside production', () => {
        const res = mockResponse();
        setAuthCookie(res, 'token');
        expect(res.cookies[0]!.options.secure).toBe(false);
    });
});
