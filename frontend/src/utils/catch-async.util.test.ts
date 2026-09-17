import { describe, expect, it } from 'vitest';
import { AxiosError } from 'axios';
import { catchAsync } from './catch-async.util';

describe('catchAsync', () => {
    it('returns [null, data] when the request resolves', async () => {
        const [error, data] = await catchAsync(
            Promise.resolve({ data: { ok: true } } as never)
        );
        expect(error).toBeNull();
        expect(data).toEqual({ ok: true });
    });

    it('returns [error, null] when the request rejects', async () => {
        const thrown = new AxiosError('Request failed');
        const [error, data] = await catchAsync(Promise.reject(thrown));
        expect(error).toBe(thrown);
        expect(data).toBeNull();
    });

    it('does not throw, so callers can branch instead of using try/catch', async () => {
        await expect(catchAsync(Promise.reject(new Error('boom')))).resolves.toBeDefined();
    });
});
