/**
 * useRecentSearches - Responsible for managing recent searches
 * Follows Single Responsibility Principle (SRP)
 */

import { useCallback, useEffect, useState } from 'react';
import { storageService } from '@/lib/services';

const RECENT_SEARCHES_KEY = 'recent-searches';
const MAX_RECENT_SEARCHES = 6;

export function useRecentSearches(isActive: boolean) {
  const [recent, setRecent] = useState<string[]>([]);

  // Load recent searches when activated
  useEffect(() => {
    if (!isActive) return;
    const stored = storageService.getItem<string[]>(RECENT_SEARCHES_KEY);
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
      storageService.setItem(RECENT_SEARCHES_KEY, next);
      return next;
    });
  }, []);

  const clearRecent = useCallback(() => {
    setRecent([]);
    storageService.removeItem(RECENT_SEARCHES_KEY);
  }, []);

  return {
    recent,
    saveRecent,
    clearRecent,
  };
}
