import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function normalizeUrl(input: string): string {
  const normalized = input.trim();
  const url =
    normalized.startsWith('http://') || normalized.startsWith('https://')
      ? normalized
      : `https://${normalized}`;

  return url;
}

export function getFaviconUrl(input: string): string {
  try {
    const normalized = normalizeUrl(input);

    const url =
      normalized.startsWith('http://') || normalized.startsWith('https://')
        ? normalized
        : `https://${normalized}`;

    const hostname = new URL(url).hostname;

    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`;
  } catch {
    return '/images/favicon-32x32.png';
  }
}
