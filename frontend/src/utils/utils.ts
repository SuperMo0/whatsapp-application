import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function matchesQuery(value: string, query: string) {
    if (!query.trim()) return true;
    const normalise = (s: string) =>
        s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
    return normalise(value).includes(normalise(query.trim()));
}
