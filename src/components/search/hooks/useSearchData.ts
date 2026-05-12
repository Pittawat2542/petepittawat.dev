/**
 * useSearchData - Responsible for fetching search data
 * Follows Single Responsibility Principle (SRP)
 */

import { useEffect, useState } from 'react';
import type { SearchItem } from '../types';

interface SearchDataResponse {
  items: SearchItem[];
}

export function useSearchData(shouldLoad: boolean) {
  const [items, setItems] = useState<SearchItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!shouldLoad || loaded) return;

    const controller = new AbortController();

    fetch('/search.json', { signal: controller.signal })
      .then(async response => {
        if (!response.ok) {
          throw new Error(`Search index request failed with status ${response.status}`);
        }

        const data = (await response.json()) as SearchDataResponse;
        setItems(data.items || []);
        setLoaded(true);
      })
      .catch(() => {
        setLoaded(true);
      });

    return () => {
      controller.abort();
    };
  }, [shouldLoad, loaded]);

  return { items, loaded };
}
