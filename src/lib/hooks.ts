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
          if (value === 'all') continue;
          const getter = options.filterFields?.[key];
          if (getter) {
            const v = getter(item);
            if (Array.isArray(v)) {
              if (!v.includes(value)) return false;
            } else {
              if (String(v) !== value) return false;
            }
          } else {
            const v = (item as any)[key];
            if (Array.isArray(v)) {
              if (!v.includes(value)) return false;
            } else {
              if (String(v) !== value) return false;
            }
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
    const result: Record<string, string[]> = {};
    
    if (options.filterFields) {
      for (const [key, getter] of Object.entries(options.filterFields)) {
        const raw = items.flatMap((it) => {
          const v = getter(it);
          return Array.isArray(v) ? v : [v];
        });
        const values = Array.from(new Set(raw.map((x) => String(x))));
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
