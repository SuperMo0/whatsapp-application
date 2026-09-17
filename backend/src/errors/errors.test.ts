import { describe, expect, it, vi } from 'vitest';
import { AppError } from './appError.ts';
import { errorHandler } from './errorHandler.ts';
import { notFound } from './notFound.ts';
import { mockNext, mockRequest, mockResponse } from '../test/express-mocks.ts';

describe('AppError', () => {
    it('carries a status alongside the message', () => {
        const err = new AppError(401, 'Invalid credentials');
        expect(err.status).toBe(401);
        expect(err.message).toBe('Invalid credentials');
        expect(err).toBeInstanceOf(Error);
    });
});

describe('errorHandler', () => {
    it('reflects an AppError status and message to the client', () => {
        const res = mockResponse();
        errorHandler(new AppError(403, 'Forbidden'), mockRequest(), res, mockNext());
        expect(res.statusCode).toBe(403);
        expect(res.body).toEqual({ message: 'Forbidden' });
    });

    it('does not leak details of an unexpected error', () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
        const res = mockResponse();

        errorHandler(new Error('connect ECONNREFUSED 10.0.0.5:5432'), mockRequest(), res, mockNext());

        expect(res.statusCode).toBe(500);
        expect(res.body).toBeUndefined();
        expect(res.ended).toBe(true);
        consoleSpy.mockRestore();
    });
});

describe('notFound', () => {
    it('responds 404 with a generic message', () => {
        const res = mockResponse();
        notFound(mockRequest(), res, mockNext());
        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual({ message: 'Route not found' });
    });
});
