// jwt.ts reads process.env.SECRET at import time, so it must exist before any
// module under test is loaded.
process.env.SECRET ??= 'test-secret-value-not-used-in-production';
process.env.NODE_ENV ??= 'test';
