import { useCallback, useEffect, useMemo, useRef, useState, type RefObject } from 'react';
import type { CSSProperties, MouseEvent as ReactMouseEvent } from 'react';

export interface FilterOptions<T> {
  searchFields: (item: T) => string[];
  // Returns a primitive or array of primitives suitable for equality matching
  filterFields?: Record<string, (item: T) => string | number | boolean | Array<string | number | boolean>>;
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
            const arr = Array.isArray(v) ? v : [v];
            if (!arr.map(String).includes(value)) return false;
          } else {
            // Fallback: try to read property by key (best-effort)
            const v = (item as unknown as Record<string, unknown>)[key];
            const arr = Array.isArray(v) ? v : [v];
            if (!arr.map(String).includes(value)) return false;
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

export function useQueryParamSync(param: string, value: string, setValue: (next: string) => void) {
  const hydratedRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const params = new URLSearchParams(window.location.search);
      const existing = params.get(param);
      if (existing) setValue(existing);
    } catch {}
    hydratedRef.current = true;
  }, [param, setValue]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handler = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const next = params.get(param) || '';
        setValue(next);
      } catch {}
    };
    window.addEventListener('popstate', handler);
    window.addEventListener('hashchange', handler);
    return () => {
      window.removeEventListener('popstate', handler);
      window.removeEventListener('hashchange', handler);
    };
  }, [param, setValue]);

  useEffect(() => {
    if (!hydratedRef.current) return;
    if (typeof window === 'undefined') return;
    try {
      const params = new URLSearchParams(window.location.search);
      const trimmed = value.trim();
      if (trimmed) {
        params.set(param, trimmed);
      } else {
        params.delete(param);
      }
      const query = params.toString();
      const url = query ? `?${query}` : window.location.pathname;
      window.history.replaceState({}, '', url);
    } catch {}
  }, [param, value]);
}

export interface InfiniteListResult<T> {
  paged: T[];
  hasMore: boolean;
  loadingMore: boolean;
  pendingSkeletons: number;
  sentinelRef: RefObject<HTMLDivElement | null>;
}

export interface InfiniteListOptions<T> {
  items: T[];
  per?: number;
  rootMargin?: string;
}

export function useInfiniteList<T>({ items, per = 12, rootMargin = '800px 0px' }: InfiniteListOptions<T>): InfiniteListResult<T> {
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const loadTimerRef = useRef<number | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const previousItemsRef = useRef(items);

  useEffect(() => {
    if (previousItemsRef.current === items) return;
    previousItemsRef.current = items;
    setPage(1);
    setLoadingMore(false);
    if (loadTimerRef.current) {
      clearTimeout(loadTimerRef.current);
      loadTimerRef.current = null;
    }
  }, [items]);

  useEffect(() => (
    () => {
      if (loadTimerRef.current) {
        clearTimeout(loadTimerRef.current);
        loadTimerRef.current = null;
      }
    }
  ), []);

  const visibleCount = Math.min(items.length, per * page);
  const paged = useMemo(() => items.slice(0, visibleCount), [items, visibleCount]);

  const hasMore = visibleCount < items.length;

  const loadNext = useCallback(() => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    if (loadTimerRef.current) clearTimeout(loadTimerRef.current);
    loadTimerRef.current = window.setTimeout(() => {
      setPage((p) => p + 1);
      setLoadingMore(false);
      loadTimerRef.current = null;
    }, 250);
  }, [hasMore, loadingMore]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) loadNext();
      }
    }, { rootMargin });
    observer.observe(node);
    return () => observer.disconnect();
  }, [loadNext, rootMargin]);

  const pendingSkeletons = hasMore ? Math.min(per, items.length - visibleCount) : 0;

  return { paged, hasMore, loadingMore, pendingSkeletons, sentinelRef };
}

export function useHashAction(prefix: string, action: (hash: string) => void, delay = 100) {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash;
    if (!hash || !hash.startsWith(`#${prefix}`)) return;
    const timer = window.setTimeout(() => action(hash), delay);
    return () => window.clearTimeout(timer);
  }, [action, delay, prefix]);
}

export function useGlassGlow<T extends HTMLElement>() {
  const glowStyle = useMemo(() => ({ '--glass-glow-x': '50%', '--glass-glow-y': '50%' } as CSSProperties), []);

  const handleMouseMove = useCallback((event: ReactMouseEvent<T>) => {
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    target.style.setProperty('--glass-glow-x', `${x}%`);
    target.style.setProperty('--glass-glow-y', `${y}%`);
  }, []);

  const handleMouseLeave = useCallback((event: ReactMouseEvent<T>) => {
    const target = event.currentTarget as HTMLElement;
    target.style.setProperty('--glass-glow-x', '50%');
    target.style.setProperty('--glass-glow-y', '50%');
  }, []);

  return { glowStyle, handleMouseMove, handleMouseLeave };
}
