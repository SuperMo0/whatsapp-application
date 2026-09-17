import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { validateBody } from './validateBody.ts';
import { validateParams } from './validateParams.ts';
import { mockNext, mockRequest, mockResponse } from '../test/express-mocks.ts';

const bodySchema = z.object({
    email: z.email(),
    password: z.string().min(8),
});

describe('validateBody', () => {
    it('calls next and replaces the body with the parsed value', () => {
        const req = mockRequest({ body: { email: 'a@b.com', password: 'longenough' } });
        const res = mockResponse();
        const next = mockNext();

        validateBody(bodySchema)(req, res, next);

        expect(next).toHaveBeenCalledOnce();
        expect(req.body).toEqual({ email: 'a@b.com', password: 'longenough' });
    });

    it('strips unknown keys so handlers cannot be fed extra fields', () => {
        const req = mockRequest({ body: { email: 'a@b.com', password: 'longenough', isAdmin: true } });
        const res = mockResponse();

        validateBody(bodySchema)(req, res, mockNext());

        expect(req.body).not.toHaveProperty('isAdmin');
    });

    it('responds 400 and does not call next when the body is invalid', () => {
        const req = mockRequest({ body: { email: 'nope', password: 'short' } });
        const res = mockResponse();
        const next = mockNext();

        validateBody(bodySchema)(req, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.statusCode).toBe(400);
        expect(res.body).toMatchObject({ message: 'Invalid Input' });
    });

    it('sets the status through status(), not by passing a number to json()', () => {
        const req = mockRequest({ body: {} });
        const res = mockResponse();

        validateBody(bodySchema)(req, res, mockNext());

        // Regression guard: res.json(400).json(...) sent 400 as the body and
        // then threw on the second call.
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.body).not.toBe(400);
    });
});

describe('validateParams', () => {
    const paramsSchema = z.object({ chatId: z.string().min(1) });

    it('calls next for valid params', () => {
        const req = mockRequest({ params: { chatId: '1' } });
        const next = mockNext();

        validateParams(paramsSchema)(req, mockResponse(), next);

        expect(next).toHaveBeenCalledOnce();
    });

    it('responds 400 for invalid params', () => {
        const req = mockRequest({ params: {} });
        const res = mockResponse();
        const next = mockNext();

        validateParams(paramsSchema)(req, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.statusCode).toBe(400);
        expect(res.body).toMatchObject({ message: 'Invalid params' });
    });
});
