/**
 * useSearchData - Responsible for fetching search data
 * Follows Single Responsibility Principle (SRP)
 */

import { useEffect, useState } from 'react';
import { httpService } from '@/lib/services';
import type { SearchItem } from '../types';

interface SearchDataResponse {
  items: SearchItem[];
}

export function useSearchData(shouldLoad: boolean) {
  const [items, setItems] = useState<SearchItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!shouldLoad || loaded) return;

    httpService
      .get<SearchDataResponse>('/search.json')
      .then(data => {
        setItems(data.items || []);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, [shouldLoad, loaded]);

  return { items, loaded };
}
