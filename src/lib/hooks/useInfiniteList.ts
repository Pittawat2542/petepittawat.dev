import { useCallback, useEffect, useMemo, useRef, useState, type RefObject } from 'react';

/**
 * Result object returned by the useInfiniteList hook
 */
export interface InfiniteListResult<T> {
  /** Items currently visible in the list */
  paged: T[];
  /** Whether there are more items to load */
  hasMore: boolean;
  /** Whether more items are currently loading */
  loadingMore: boolean;
  /** Number of skeleton loaders to show */
  pendingSkeletons: number;
  /** Ref for the sentinel element used to trigger loading */
  sentinelRef: RefObject<HTMLDivElement | null>;
}

/**
 * Options for configuring the useInfiniteList hook
 */
export interface InfiniteListOptions<T> {
  /** Array of items to paginate */
  items: T[];
  /** Number of items to load per page (default: 12) */
  per?: number;
  /** Intersection observer root margin (default: '800px 0px') */
  rootMargin?: string;
}

/**
 * React hook for implementing infinite scrolling lists
 *
 * @template T - Type of items in the list
 * @param options - Infinite list options
 * @returns Infinite list result object with paged data and control properties
 *
 * @example
 * ```tsx
 * const { paged, hasMore, loadingMore, sentinelRef } = useInfiniteList({
 *   items: allPosts,
 *   per: 10
 * });
 *
 * return (
 *   <div>
 *     {paged.map(item => <Item key={item.id} item={item} />)}
 *     {loadingMore && <LoadingSpinner />}
 *     {hasMore && <div ref={sentinelRef} />}
 *   </div>
 * );
 * ```
 */
export function useInfiniteList<T>({
  items,
  per = 12,
  rootMargin = '800px 0px',
}: InfiniteListOptions<T>): InfiniteListResult<T> {
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

  useEffect(
    () => () => {
      if (loadTimerRef.current) {
        clearTimeout(loadTimerRef.current);
        loadTimerRef.current = null;
      }
    },
    []
  );

  const visibleCount = Math.min(items.length, per * page);
  const paged = useMemo(() => items.slice(0, visibleCount), [items, visibleCount]);

  const hasMore = visibleCount < items.length;

  const loadNext = useCallback(() => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    if (loadTimerRef.current) clearTimeout(loadTimerRef.current);
    loadTimerRef.current = window.setTimeout(() => {
      setPage(p => p + 1);
      setLoadingMore(false);
      loadTimerRef.current = null;
    }, 250);
  }, [hasMore, loadingMore]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) loadNext();
        }
      },
      { rootMargin }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [loadNext, rootMargin]);

  const pendingSkeletons = hasMore ? Math.min(per, items.length - visibleCount) : 0;

  return { paged, hasMore, loadingMore, pendingSkeletons, sentinelRef };
}
