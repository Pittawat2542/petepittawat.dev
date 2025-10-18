import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { CSSProperties } from 'react';

/**
 * Combines CSS class names using clsx and tailwind-merge for conflict resolution.
 * This utility helps manage conditional styling and prevents CSS specificity issues.
 *
 * @param inputs - Class values to combine (strings, objects, arrays)
 * @returns Merged class names with conflicts resolved
 *
 * @example
 * ```tsx
 * <div className={cn('text-red-500', isActive && 'font-bold')} />
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Converts an accent color identifier to a CSS variable reference.
 * Handles both direct CSS variables and named color identifiers.
 *
 * @param accent - Color identifier or CSS variable
 * @returns CSS variable reference string
 *
 * @example
 * ```ts
 * getAccentColorVar('blue') // Returns 'var(--blue)'
 * getAccentColorVar('var(--custom-color)') // Returns 'var(--custom-color)'
 * ```
 */
export function getAccentColorVar(accent: string): string {
  const trimmed = accent.trim();
  if (!trimmed) return 'var(--page-accent, var(--accent))';
  return trimmed.startsWith('var(') ? trimmed : `var(--${trimmed})`;
}

/**
 * Creates CSS properties object with accent color variable for styling components.
 * Used to pass accent colors to components through CSS custom properties.
 *
 * @param accent - Color identifier or CSS variable
 * @returns CSS properties object with --card-accent custom property
 *
 * @example
 * ```tsx
 * <Card style={createAccentStyle('blue-500')} />
 * ```
 */
export function createAccentStyle(accent: string): CSSProperties {
  return {
    '--card-accent': getAccentColorVar(accent),
  } as CSSProperties;
}

/**
 * Formats a date for display in a consistent format across the application.
 * Uses fixed locale and timezone to prevent SSR/CSR hydration mismatches.
 *
 * @param date - Date to format (string, number, or Date object)
 * @returns Formatted date string (e.g., "Oct 18, 2025")
 *
 * @example
 * ```ts
 * formatDate(new Date('2025-10-18')) // Returns "Oct 18, 2025"
 * ```
 */
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

/**
 * Normalizes author name strings by standardizing the format.
 * Converts "A, B, C, and D" format to an array of individual names.
 *
 * @param input - Raw author string
 * @returns Array of normalized author names
 *
 * @example
 * ```ts
 * normalizeAuthors('Doe, John, and Smith, Jane') // Returns ['Doe', 'John', 'Smith', 'Jane']
 * ```
 */
function normalizeAuthors(input: string) {
  // Turn "A, B, C, and D" into [A,B,C,D]
  const normalized = input.replace(/\s+(and)\s+/gi, ', ');
  return normalized
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);
}

/**
 * Checks if the first author in a list matches the site owner.
 * Used to highlight the site owner's publications and work.
 *
 * @param authors - Comma-separated author string
 * @returns True if the first author is the site owner
 *
 * @example
 * ```ts
 * isFirstAuthor('Pittawat Taveekitworachai, Jane Smith') // Returns true
 * ```
 */
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

/**
 * Normalizes and formats author names for display.
 * Returns a clean, comma-separated string of author names.
 *
 * @param authors - Comma-separated author string
 * @returns Normalized author names string
 *
 * @example
 * ```ts
 * highlightAuthorNames('Doe, John, and Smith, Jane') // Returns "Doe, John, Smith, Jane"
 * ```
 */
export function highlightAuthorNames(authors: string) {
  // For now, return a normalized comma-separated string. Keeping it simple
  // avoids JSX from a shared lib file used by both Astro and React.
  return normalizeAuthors(authors).join(', ');
}
