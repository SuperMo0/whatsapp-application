import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { bubbleTime, dayLabel, fixDate, listTime } from './Dates.util';

// Fixed reference point so "today" and "yesterday" are deterministic.
const NOW = new Date('2026-09-17T14:30:00');

beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
});

afterEach(() => {
    vi.useRealTimers();
});

describe('bubbleTime', () => {
    it('renders 24-hour clock time', () => {
        expect(bubbleTime(new Date('2026-09-17T09:05:00'))).toBe('09:05');
        expect(bubbleTime(new Date('2026-09-17T22:31:00'))).toBe('22:31');
    });
});

describe('listTime', () => {
    it('shows clock time for today', () => {
        expect(listTime(new Date('2026-09-17T08:15:00'))).toBe('08:15');
    });

    it('shows "Yesterday" for the previous calendar day', () => {
        expect(listTime(new Date('2026-09-16T23:59:00'))).toBe('Yesterday');
    });

    it('shows the weekday within the last week', () => {
        expect(listTime(new Date('2026-09-14T10:00:00'))).toBe('Mon');
    });

    it('falls back to a numeric date beyond a week', () => {
        expect(listTime(new Date('2026-08-01T10:00:00'))).toBe('01/08/2026');
    });

    it('treats an ISO string the same as a Date', () => {
        expect(listTime('2026-09-17T08:15:00')).toBe('08:15');
    });
});

describe('dayLabel', () => {
    it('labels today and yesterday by name', () => {
        expect(dayLabel(new Date('2026-09-17T01:00:00'))).toBe('Today');
        expect(dayLabel(new Date('2026-09-16T01:00:00'))).toBe('Yesterday');
    });

    it('uses the full weekday within the last week', () => {
        expect(dayLabel(new Date('2026-09-14T10:00:00'))).toBe('Monday');
    });

    it('uses a full date beyond a week', () => {
        expect(dayLabel(new Date('2026-08-01T10:00:00'))).toBe('1 August 2026');
    });
});

describe('fixDate', () => {
    it('renders a day, month and 12-hour time', () => {
        expect(fixDate(new Date('2026-09-17T14:30:00'))).toBe('17 Sep, 02:30 PM');
    });
});
