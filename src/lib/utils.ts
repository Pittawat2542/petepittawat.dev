/**
 * Custom hook for filtering data
 */
import { useMemo, useState } from 'react';

import { AUTHOR_NAMES } from './constants';
import React from "react";

/**
 * Format a date string to a human-readable format
 * @param iso - ISO date string
 * @returns Formatted date string
 */
export function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return iso;
  }
}

/**
 * Highlight author names in a string
 * @param authors - Authors string
 * @param names - Names to highlight
 * @returns JSX elements with highlighted names
 */
export function highlightAuthorNames(
  authors: string,
  names: string[] = [AUTHOR_NAMES.FIRST_NAME, AUTHOR_NAMES.LAST_NAME]
): React.ReactNode[] {
  const pattern = new RegExp(`(${names.join("|")})`, "gi");
  const parts = authors.split(pattern);

  return parts.map((part, i) =>
    pattern.test(part)
      ? React.createElement("strong", { key: i, className: "text-[color:var(--accent)]" }, part)
      : React.createElement("span", { key: i }, part)
  );
}

/**
 * Check if an author is the first author
 * @param authors - Authors string
 * @param firstName - First name to check
 * @param lastName - Last name to check
 * @returns Boolean indicating if the author is first
 */
export function isFirstAuthor(authors: string, firstName: string = AUTHOR_NAMES.FIRST_NAME, lastName: string = AUTHOR_NAMES.LAST_NAME): boolean {
  // Normalize separators and get first name block
  const normalized = authors.replace(/\sand\s/gi, ', ');
  const [first = ''] = normalized.split(',');
  const lowerFirst = first.toLowerCase();
  return lowerFirst.includes(firstName.toLowerCase()) || lowerFirst.includes(lastName.toLowerCase());
}


export function useFilter<T>(items: T[], searchFields: (item: T) => string[]) {
  const [q, setQ] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({});

  const filtered = useMemo(() => {
    const qLower = q.trim().toLowerCase();
    return items.filter((item) => {
      // Apply filters
      for (const [key, value] of Object.entries(filters)) {
        if (value !== 'all' && (item as any)[key] !== value) {
          return false;
        }
      }
      
      // Apply search
      if (!qLower) return true;
      const hay = searchFields(item).join(' ').toLowerCase();
      return hay.includes(qLower);
    });
  }, [items, q, filters]);

  return {
    q,
    setQ,
    filters,
    setFilters,
    filtered
  };
}

/**
 * Get unique values from an array of objects
 */
export function getUniqueValues<T>(items: T[], key: keyof T): T[keyof T][] {
  return Array.from(new Set(items.map(item => item[key]))) as T[keyof T][];
}

/**
 * Get unique values from nested arrays in objects
 */
export function getUniqueNestedValues<T>(items: T[], key: keyof T): string[] {
  return Array.from(new Set(items.flatMap(item => (item[key] as any) || []))) as string[];
}