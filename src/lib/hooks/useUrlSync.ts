/**
 * useUrlSync - Responsible for synchronizing state with URL parameters
 * Follows Single Responsibility Principle (SRP) and Dependency Inversion Principle (DIP)
 */

import { useEffect } from 'react';

interface UrlSyncParams {
  enabled?: boolean;
  query?: string;
  sort?: string;
  selectedTags?: Set<string>;
  filters?: Record<string, string>;
  lang?: string;
}

export function useUrlSync(params: UrlSyncParams) {
  const { enabled = true, query = '', sort, selectedTags, filters = {}, lang } = params;

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    const urlParams = new URLSearchParams();

    const trimmed = query.trim();
    if (trimmed) urlParams.set('q', trimmed);

    if (sort && sort !== 'newest') urlParams.set('sort', sort);

    if (selectedTags?.size) {
      for (const tag of Array.from(selectedTags).sort()) {
        urlParams.append('tag', tag);
      }
    }

    if (filters['year']?.length && filters['year'] !== 'all') {
      urlParams.set('year', filters['year']);
    }

    if (filters['series']?.length && filters['series'] !== 'all') {
      urlParams.set('series', filters['series']);
    }

    if (lang) {
      urlParams.set('lang', lang);
    }

    const queryString = urlParams.toString();
    const url = queryString ? `?${queryString}` : window.location.pathname;
    window.history.replaceState({}, '', url);
  }, [enabled, filters, lang, query, selectedTags, sort]);
}
