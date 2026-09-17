import { describe, expect, it } from 'vitest';
import { cn, matchesQuery } from './utils';

describe('cn', () => {
    it('merges conflicting tailwind classes, last one winning', () => {
        expect(cn('p-2', 'p-4')).toBe('p-4');
    });

    it('keeps non-conflicting classes', () => {
        expect(cn('flex', 'items-center')).toBe('flex items-center');
    });

    it('drops falsy values so conditional classes are safe', () => {
        expect(cn('flex', false && 'hidden', undefined, null)).toBe('flex');
    });

    it('resolves conflicts per responsive variant independently', () => {
        expect(cn('hidden md:block', 'md:hidden')).toBe('hidden md:hidden');
    });
});

describe('matchesQuery', () => {
    it('matches everything when the query is empty or whitespace', () => {
        expect(matchesQuery('Jane Cooper', '')).toBe(true);
        expect(matchesQuery('Jane Cooper', '   ')).toBe(true);
    });

    it('ignores case', () => {
        expect(matchesQuery('Jane Cooper', 'jane')).toBe(true);
        expect(matchesQuery('jane cooper', 'JANE')).toBe(true);
    });

    it('matches on a substring anywhere in the name', () => {
        expect(matchesQuery('Jane Cooper', 'oop')).toBe(true);
    });

    it('ignores diacritics in both the value and the query', () => {
        expect(matchesQuery('Renée Zellweger', 'renee')).toBe(true);
        expect(matchesQuery('Renee Zellweger', 'renée')).toBe(true);
        expect(matchesQuery('Ångström', 'angstrom')).toBe(true);
    });

    it('trims surrounding whitespace from the query', () => {
        expect(matchesQuery('Jane Cooper', '  jane  ')).toBe(true);
    });

    it('returns false when there is no match', () => {
        expect(matchesQuery('Jane Cooper', 'zzz')).toBe(false);
    });
});
