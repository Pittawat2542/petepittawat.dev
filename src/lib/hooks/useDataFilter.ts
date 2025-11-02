import { useCallback, useMemo, useState } from 'react';
import { COMPONENT_CONFIG } from '@/lib/constants';

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
 * Data filtering hook for search and filter functionality
 */
export function useDataFilter<T>(
  items: readonly T[],
  options: FilterOptions<T>
): UseDataFilterReturn<T> {
  const [q, setQ] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({});

  const filtered = useMemo(() => {
    const qLower = q.trim().toLowerCase();
    if (items.length === 0) return [];

    return items.filter(item => {
      // Apply filters
      for (const [key, value] of Object.entries(filters)) {
        if (value === 'all' || value === '') continue;

        const getter = options.filterFields?.[key];
        const fieldValue = getter
          ? getter(item)
          : (item as unknown as Record<string, unknown>)[key];
        const valueArray = Array.isArray(fieldValue) ? fieldValue : [fieldValue];

        if (!valueArray.map(String).includes(value)) {
          return false;
        }
      }

      // Apply search
      if (qLower && qLower.length >= COMPONENT_CONFIG.FILTER.MIN_SEARCH_LENGTH) {
        const searchText = options.searchFields(item).join(' ').toLowerCase();
        return searchText.includes(qLower);
      }

      return true;
    });
  }, [items, q, filters, options]);

  const filterOptions = useMemo(() => {
    const result: Record<string, string[]> = {};
    if (!options.filterFields) return result;

    for (const [key, getter] of Object.entries(options.filterFields)) {
      const rawValues = items.flatMap(item => {
        const value = getter(item);
        return Array.isArray(value) ? value : [value];
      });

      const uniqueValues = Array.from(
        new Set(rawValues.filter(value => value != null && value !== '').map(String))
      ).sort((a, b) => a.localeCompare(b));

      result[key] = uniqueValues;
    }

    return result;
  }, [items, options.filterFields]);

  const clearFilters = useCallback(() => {
    setFilters({});
    setQ('');
  }, []);

  const hasActiveFilters = useMemo(
    () =>
      Object.values(filters).some(value => value !== '' && value !== 'all') || q.trim().length > 0,
    [filters, q]
  );

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
