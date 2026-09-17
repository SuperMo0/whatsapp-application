import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

export default defineConfig({
    resolve: {
        alias: [
            { find: /^@\/(.*)\.js$/, replacement: fileURLToPath(new URL('./src/$1.ts', import.meta.url)) },
            { find: /^@\/(.*)\.ts$/, replacement: fileURLToPath(new URL('./src/$1.ts', import.meta.url)) },
            { find: /^@\/(.*)$/, replacement: fileURLToPath(new URL('./src/$1', import.meta.url)) },
        ],
    },
    test: {
        environment: 'node',
        globals: true,
        include: ['src/**/*.{test,spec}.ts'],
        setupFiles: ['./src/test/setup.ts'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'lcov'],
            include: ['src/**/*.ts'],
            exclude: ['src/**/*.{test,spec}.ts', 'src/test/**', 'src/index.ts', 'src/types/**'],
        },
    },
});
