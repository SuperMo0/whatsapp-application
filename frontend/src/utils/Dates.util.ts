import { format, isToday, isYesterday, differenceInCalendarDays } from "date-fns";

export function fixDate(timestamp: string | Date) {
    return format(new Date(timestamp), 'd MMM, hh:mm a');
}

export function bubbleTime(timestamp: string | Date) {
    return format(new Date(timestamp), 'HH:mm');
}

export function listTime(timestamp: string | Date) {
    const date = new Date(timestamp);
    if (isToday(date)) return format(date, 'HH:mm');
    if (isYesterday(date)) return 'Yesterday';
    if (differenceInCalendarDays(new Date(), date) < 7) return format(date, 'EEE');
    return format(date, 'dd/MM/yyyy');
}

export function dayLabel(timestamp: string | Date) {
    const date = new Date(timestamp);
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    if (differenceInCalendarDays(new Date(), date) < 7) return format(date, 'EEEE');
    return format(date, 'd MMMM yyyy');
}
