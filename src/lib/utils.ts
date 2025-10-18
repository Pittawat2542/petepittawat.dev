import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { CSSProperties } from 'react';

// Tailwind class combiner used by shadcn components
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getAccentColorVar(accent: string): string {
  const trimmed = accent.trim();
  if (!trimmed) return 'var(--page-accent, var(--accent))';
  return trimmed.startsWith('var(') ? trimmed : `var(--${trimmed})`;
}

export function createAccentStyle(accent: string): CSSProperties {
  return {
    '--card-accent': getAccentColorVar(accent),
  } as CSSProperties;
}

// Domain helpers used across UI components
export function formatDate(date: string | number | Date) {
  try {
    const d = new Date(date);
    // Use a fixed locale and timezone to avoid SSR/CSR hydration mismatches
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      timeZone: 'UTC',
    }).format(d);
  } catch {
    return String(date);
  }
}

function normalizeAuthors(input: string) {
  // Turn "A, B, C, and D" into [A,B,C,D]
  const normalized = input.replace(/\s+(and)\s+/gi, ', ');
  return normalized
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);
}

export function isFirstAuthor(authors: string) {
  const list = normalizeAuthors(authors);
  if (!list.length) return false;
  const first = list[0];
  if (!first) return false;
  const firstLower = first.toLowerCase();
  // Match against site owner name
  const full = 'pittawat taveekitworachai';
  return (
    firstLower.includes('pittawat') ||
    firstLower.includes('taveekitworachai') ||
    firstLower === full
  );
}

export function highlightAuthorNames(authors: string) {
  // For now, return a normalized comma-separated string. Keeping it simple
  // avoids JSX from a shared lib file used by both Astro and React.
  return normalizeAuthors(authors).join(', ');
}
