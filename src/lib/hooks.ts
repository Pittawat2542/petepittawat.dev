import { useMemo, useState } from 'react';

export interface FilterOptions<T> {
  searchFields: (item: T) => string[];
  filterFields?: Record<string, (item: T) => any>;
}

export function useDataFilter<T>(items: T[], options: FilterOptions<T>) {
  const [q, setQ] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({});

  const filtered = useMemo(() => {
    const qLower = q.trim().toLowerCase();
    return items
      .filter((item) => {
        // Apply filters
        for (const [key, value] of Object.entries(filters)) {
          if (value !== 'all' && (item as any)[key] !== value) {
            return false;
          }
        }
        
        // Apply search
        if (!qLower) return true;
        const hay = options.searchFields(item).join(' ').toLowerCase();
        return hay.includes(qLower);
      });
  }, [items, q, filters, options]);

  // Extract unique values for filter options
  const filterOptions = useMemo(() => {
    const result: Record<string, any[]> = {};
    
    if (options.filterFields) {
      for (const [key, getter] of Object.entries(options.filterFields)) {
        const values = Array.from(new Set(items.map(getter)));
        result[key] = values;
      }
    }
    
    return result;
  }, [items, options.filterFields]);

  return {
    q,
    setQ,
    filters,
    setFilters,
    filtered,
    filterOptions
  };
}