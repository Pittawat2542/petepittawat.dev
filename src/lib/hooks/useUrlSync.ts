/**
 * useUrlSync - Responsible for synchronizing state with URL parameters
 * Follows Single Responsibility Principle (SRP) and Dependency Inversion Principle (DIP)
 */

import { useEffect } from 'react';
import { navigationService } from '@/lib/services';

interface UrlSyncParams {
  query?: string;
  sort?: string;
  selectedTags?: Set<string>;
  filters?: Record<string, string>;
}

export function useUrlSync(params: UrlSyncParams) {
  const { query = '', sort, selectedTags, filters = {} } = params;

  useEffect(() => {
    const urlParams = new URLSearchParams();

    const trimmed = query.trim();
    if (trimmed) urlParams.set('q', trimmed);

    if (sort && sort !== 'newest') urlParams.set('sort', sort);

    if (selectedTags && selectedTags.size) {
      for (const tag of Array.from(selectedTags).sort()) {
        urlParams.append('tag', tag);
      }
    }

    if (filters['year'] && filters['year'] !== 'all') {
      urlParams.set('year', filters['year']);
    }

    if (filters['series'] && filters['series'] !== 'all') {
      urlParams.set('series', filters['series']);
    }

    const queryString = urlParams.toString();
    const url = queryString ? `?${queryString}` : navigationService.getCurrentPathname();
    navigationService.replaceState(url);
  }, [query, sort, selectedTags, filters]);
}
