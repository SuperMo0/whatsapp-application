import { describe, expect, it } from 'vitest';
import { generateToken, verify } from './jwt.ts';

describe('jwt', () => {
    it('round-trips a user id', async () => {
        const token = await generateToken({ id: 'user-123' });
        const payload = await verify(token);
        expect(payload.userId).toBe('user-123');
    });

    it('issues a compact JWS with three segments', async () => {
        const token = await generateToken({ id: 'user-123' });
        expect(token.split('.')).toHaveLength(3);
    });

    it('sets issued-at and a two-day expiry', async () => {
        const token = await generateToken({ id: 'user-123' });
        const payload = await verify(token);
        expect(payload.iat).toBeTypeOf('number');
        expect(payload.exp! - payload.iat!).toBe(2 * 24 * 60 * 60);
    });

    it('rejects a tampered payload', async () => {
        const token = await generateToken({ id: 'user-123' });
        const [header, , signature] = token.split('.');
        const forged = Buffer.from(JSON.stringify({ userId: 'attacker' })).toString('base64url');
        await expect(verify(`${header}.${forged}.${signature}`)).rejects.toThrow();
    });

    it('rejects a token that is not a JWT at all', async () => {
        await expect(verify('not-a-token')).rejects.toThrow();
    });
});
