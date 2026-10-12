/**
 * useSearchData - Responsible for fetching search data
 * Follows Single Responsibility Principle (SRP)
 */

import { useEffect, useState } from 'react';
import type { SearchItem } from '../types';
import { loadSearchData } from '@/scripts/search-data';

export function useSearchData(shouldLoad: boolean) {
  const [items, setItems] = useState<SearchItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!shouldLoad || loaded) return;

    let active = true;
    loadSearchData()
      .then(data => {
        if (!active) return;
        setFailed(false);
        setItems(data);
        setLoaded(true);
      })
      .catch(() => {
        if (!active) return;
        setFailed(true);
      });
    return () => {
      active = false;
    };
  }, [shouldLoad, loaded, attempt]);

  return {
    items,
    loaded,
    failed,
    retry: () => {
      setFailed(false);
      setAttempt(value => value + 1);
    },
  };
}
