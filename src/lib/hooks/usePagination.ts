/* eslint-disable */
import { useMemo, useState } from 'react';

export type PaginationResult<T> = {
  paginated: T[];
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  setPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  goToPage: (page: number) => void;
  setPerPage: (perPage: number) => void;
};

export interface PaginationOptions<T> {
  items: T[];
  perPage?: number;
  initialPage?: number;
}

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
