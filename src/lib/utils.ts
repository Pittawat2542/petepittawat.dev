import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Tailwind class combiner used by shadcn components
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Domain helpers used across UI components
export function formatDate(date: string | number | Date) {
  try {
    const d = new Date(date);
    return d.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    });
  } catch {
    return String(date);
  }
}

function normalizeAuthors(input: string) {
  // Turn "A, B, C, and D" into [A,B,C,D]
  const normalized = input.replace(/\s+(and)\s+/gi, ', ');
  return normalized
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

export function isFirstAuthor(authors: string) {
  const list = normalizeAuthors(authors);
  if (!list.length) return false;
  const first = list[0].toLowerCase();
  // Match against site owner name
  const full = 'pittawat taveekitworachai';
  return first.includes('pittawat') || first.includes('taveekitworachai') || first === full;
}

export function highlightAuthorNames(authors: string) {
  // For now, return a normalized comma-separated string. Keeping it simple
  // avoids JSX from a shared lib file used by both Astro and React.
  return normalizeAuthors(authors).join(', ');
}
