/**
 * useRecentSearches - Responsible for managing recent searches
 * Follows Single Responsibility Principle (SRP)
 */

import { useCallback, useEffect, useState } from 'react';

const RECENT_SEARCHES_KEY = 'recent-searches';
const MAX_RECENT_SEARCHES = 6;

function readRecentSearches() {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(RECENT_SEARCHES_KEY);
    return raw ? (JSON.parse(raw) as string[]) : null;
  } catch {
    return null;
  }
}

function writeRecentSearches(value: string[]) {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(value));
  } catch {
    // Ignore storage write failures.
  }
}

function clearStoredRecentSearches() {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.removeItem(RECENT_SEARCHES_KEY);
  } catch {
    // Ignore storage removal failures.
  }
}

export function useRecentSearches(isActive: boolean) {
  const [recent, setRecent] = useState<string[]>([]);

  // Load recent searches when activated
  useEffect(() => {
    if (!isActive) return;
    const stored = readRecentSearches();
    if (stored) setRecent(stored);
  }, [isActive]);

  const saveRecent = useCallback((value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;

    setRecent(prev => {
      const next = [
        trimmed,
        ...prev.filter(entry => entry.toLowerCase() !== trimmed.toLowerCase()),
      ].slice(0, MAX_RECENT_SEARCHES);
      writeRecentSearches(next);
      return next;
    });
  }, []);

  const clearRecent = useCallback(() => {
    setRecent([]);
    clearStoredRecentSearches();
  }, []);

  return {
    recent,
    saveRecent,
    clearRecent,
  };
}
