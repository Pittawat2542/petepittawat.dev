import { useCallback, useMemo, useState } from 'react';

import { COMPONENT_CONFIG } from '../constants';

// Type definitions for better type safety
export interface FilterOptions<T> {
  readonly searchFields: (item: T) => readonly string[];
  readonly filterFields?: Readonly<
    Record<string, (item: T) => string | number | boolean | readonly (string | number | boolean)[]>
  >;
}

export interface UseDataFilterReturn<T> {
  readonly q: string;
  readonly setQ: (query: string) => void;
  readonly filters: Readonly<Record<string, string>>;
  readonly setFilters: (updater: (prev: Record<string, string>) => Record<string, string>) => void;
  readonly filtered: readonly T[];
  readonly filterOptions: Readonly<Record<string, readonly string[]>>;
  readonly totalCount: number;
  readonly filteredCount: number;
  readonly clearFilters: () => void;
  readonly hasActiveFilters: boolean;
}

/**
 * Enhanced data filtering hook with improved performance and type safety
 * Provides search and filter functionality for list data
 */
export function useDataFilter<T>(
  items: readonly T[],
  options: FilterOptions<T>
): UseDataFilterReturn<T> {
  const [q, setQState] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({});

  // Debounced query setter to improve performance
  const setQ = useCallback((query: string) => {
    // Validate query length
    if (query.length > COMPONENT_CONFIG.FILTER.MAX_SEARCH_LENGTH) {
      console.warn(
        `Search query truncated to ${COMPONENT_CONFIG.FILTER.MAX_SEARCH_LENGTH} characters`
      );
      query = query.slice(0, COMPONENT_CONFIG.FILTER.MAX_SEARCH_LENGTH);
    }
    setQState(query);
  }, []);

  // Memoized filtered results with performance optimization
  const filtered = useMemo(() => {
    const qLower = q.trim().toLowerCase();

    // Early return for empty data
    if (items.length === 0) {
      return [];
    }

    return items
      .filter(item => {
        // Apply filters first (usually more selective)
        for (const [key, value] of Object.entries(filters)) {
          if (value === 'all' || value === '') continue;

          const getter = options.filterFields?.[key];
          if (getter) {
            const fieldValue = getter(item);
            const valueArray = Array.isArray(fieldValue) ? fieldValue : [fieldValue];
            if (!valueArray.map(String).includes(value)) {
              return false;
            }
          } else {
            // Fallback: try to read property by key
            const fieldValue = (item as unknown as Record<string, unknown>)[key];
            const valueArray = Array.isArray(fieldValue) ? fieldValue : [fieldValue];
            if (!valueArray.map(String).includes(value)) {
              return false;
            }
          }
        }

        // Apply search if query exists and meets minimum length
        if (qLower && qLower.length >= COMPONENT_CONFIG.FILTER.MIN_SEARCH_LENGTH) {
          try {
            const searchText = options.searchFields(item).join(' ').toLowerCase();
            return searchText.includes(qLower);
          } catch (error) {
            console.warn('Error in search fields function:', error);
            return false;
          }
        }

        return true;
      })
      .slice(0, COMPONENT_CONFIG.FILTER.MAX_RESULTS); // Limit results for performance
  }, [items, q, filters, options]);

  // Memoized filter options with error handling
  const filterOptions = useMemo(() => {
    const result: Record<string, string[]> = {};

    if (!options.filterFields) {
      return result;
    }

    try {
      for (const [key, getter] of Object.entries(options.filterFields)) {
        const rawValues = items.flatMap(item => {
          try {
            const value = getter(item);
            return Array.isArray(value) ? value : [value];
          } catch (error) {
            console.warn(`Error getting filter value for key "${key}":`, error);
            return [];
          }
        });

        const uniqueValues = Array.from(
          new Set(
            rawValues.filter(value => value != null && value !== '').map(value => String(value))
          )
        ).sort((a, b) => a.localeCompare(b));

        result[key] = uniqueValues;
      }
    } catch (error) {
      console.error('Error building filter options:', error);
    }

    return result;
  }, [items, options.filterFields]);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters({});
    setQState('');
  }, []);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    const hasFilters = Object.values(filters).some(value => value !== '' && value !== 'all');
    const hasQuery = q.trim().length > 0;
    return hasFilters || hasQuery;
  }, [filters, q]);

  return {
    q,
    setQ,
    filters,
    setFilters,
    filtered,
    filterOptions,
    totalCount: items.length,
    filteredCount: filtered.length,
    clearFilters,
    hasActiveFilters,
  };
}
