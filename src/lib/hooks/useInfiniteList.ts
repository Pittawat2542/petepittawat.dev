import { useCallback, useEffect, useMemo, useRef, useState, type RefObject } from 'react';

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