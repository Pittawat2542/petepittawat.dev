/* eslint-disable */
import { useMemo, useState } from 'react';

/**
 * Result object returned by the usePagination hook
 */
export type PaginationResult<T> = {
  /** Items for the current page */
  paginated: T[];
  /** Current page number (1-indexed) */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Whether there is a next page */
  hasNextPage: boolean;
  /** Whether there is a previous page */
  hasPrevPage: boolean;
  /** Set the current page */
  setPage: (page: number) => void;
  /** Go to the next page */
  nextPage: () => void;
  /** Go to the previous page */
  prevPage: () => void;
  /** Go to a specific page */
  goToPage: (page: number) => void;
  /** Set the number of items per page */
  setPerPage: (perPage: number) => void;
};

/**
 * Options for configuring the usePagination hook
 */
export interface PaginationOptions<T> {
  /** Array of items to paginate */
  items: T[];
  /** Number of items per page (default: 12) */
  perPage?: number;
  /** Initial page to display (default: 1) */
  initialPage?: number;
}

/**
 * React hook for paginating arrays of data
 *
 * @template T - Type of items being paginated
 * @param options - Pagination options
 * @returns Pagination result object with paginated data and control functions
 *
 * @example
 * ```tsx
 * const { paginated, currentPage, totalPages, nextPage, prevPage } = usePagination({
 *   items: allPosts,
 *   perPage: 10,
 *   initialPage: 1
 * });
 *
 * return (
 *   <div>
 *     {paginated.map(item => <Item key={item.id} item={item} />)}
 *     <button onClick={prevPage} disabled={!hasPrevPage}>Previous</button>
 *     <span>Page {currentPage} of {totalPages}</span>
 *     <button onClick={nextPage} disabled={!hasNextPage}>Next</button>
 *   </div>
 * );
 * ```
 */
export function usePagination<T>({
  items,
  perPage: initialPerPage = 12,
  initialPage = 1,
}: PaginationOptions<T>): PaginationResult<T> {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [perPage, setPerPageState] = useState(initialPerPage);

  const { paginated, totalPages, hasNextPage, hasPrevPage } = useMemo(() => {
    const totalItems = items.length;
    const totalPages = Math.ceil(totalItems / perPage);
    const clampedPage = Math.max(1, Math.min(currentPage, totalPages || 1));

    const start = (clampedPage - 1) * perPage;
    const end = start + perPage;
    const paginated = items.slice(start, end);

    return {
      paginated,
      totalPages,
      hasNextPage: clampedPage < totalPages,
      hasPrevPage: clampedPage > 1,
    };
  }, [items, perPage, currentPage]);

  const goToPage = (page: number) => {
    const clampedPage = Math.max(1, Math.min(page, totalPages || 1));
    setCurrentPage(clampedPage);
  };

  const nextPage = () => {
    if (hasNextPage) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const prevPage = () => {
    if (hasPrevPage) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const setPerPage = (newPerPage: number) => {
    setPerPageState(newPerPage);
    // Reset to first page when changing perPage
    setCurrentPage(1);
  };

  return {
    paginated,
    currentPage,
    totalPages,
    hasNextPage,
    hasPrevPage,
    setPage: goToPage,
    nextPage,
    prevPage,
    goToPage,
    setPerPage,
  };
}
