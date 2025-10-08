import type { ChangeEvent, FC, KeyboardEvent } from 'react';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';

import { cn } from '@/lib/utils';
import Selector from '../interaction/Selector';
import GlassButton from './GlassButton';

interface PageControlsProps {
  readonly total: number;
  readonly visible: number;
  readonly perPage: number;
  readonly onPerPageChange: (n: number) => void;
  readonly onLoadMore?: () => void;
  readonly className?: string;
  readonly perPageOptions?: readonly number[];
  // Pagination props
  readonly currentPage?: number;
  readonly totalPages?: number;
  readonly onPageChange?: (page: number) => void;
}

const PageControlsComponent: FC<PageControlsProps> = ({
  total,
  visible,
  perPage,
  onPerPageChange,
  onLoadMore,
  className,
  perPageOptions = [6, 12, 24, 48],
  currentPage = 1,
  totalPages = 1,
  onPageChange,
}) => {
  const [isEditingPage, setIsEditingPage] = useState(false);
  const [tempPage, setTempPage] = useState(currentPage?.toString() || '1');

  // Auto-scroll to top when page changes
  useEffect(() => {
    if (currentPage && typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentPage]);

  const handlePageClick = useCallback(() => {
    setIsEditingPage(true);
    setTempPage(currentPage?.toString() || '1');
  }, [currentPage]);

  const handlePageSubmit = useCallback(() => {
    const page = parseInt(tempPage, 10);
    if (!Number.isNaN(page) && page >= 1 && page <= (totalPages || 1) && onPageChange) {
      onPageChange(page);
    }
    setIsEditingPage(false);
  }, [tempPage, totalPages, onPageChange]);

  const handlePageKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        handlePageSubmit();
      } else if (e.key === 'Escape') {
        setIsEditingPage(false);
      }
    },
    [handlePageSubmit]
  );

  const handlePageChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numeric input
    if (value === '' || /^\d+$/.test(value)) {
      setTempPage(value);
    }
  }, []);

  const handlePrevPage = useCallback(() => {
    if (currentPage && currentPage > 1 && onPageChange) {
      onPageChange(currentPage - 1);
    }
  }, [currentPage, onPageChange]);

  const handleNextPage = useCallback(() => {
    if (currentPage && currentPage < (totalPages || 1) && onPageChange) {
      onPageChange(currentPage + 1);
    }
  }, [currentPage, totalPages, onPageChange]);

  const perPageSelectorOptions = useMemo(
    () => perPageOptions.map(n => ({ value: String(n), label: String(n) })),
    [perPageOptions]
  );

  const canLoadMore = Boolean(onLoadMore) && visible < total;

  return (
    <div className={cn('flex items-center justify-between gap-3', className)}>
      <div className="text-muted-foreground text-sm">
        Showing <span className="text-foreground font-medium">{visible}</span> of{' '}
        <span className="text-foreground font-medium">{total}</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-sm">Per page:</span>
          <Selector
            label="Items per page"
            value={String(perPage)}
            onChange={v => onPerPageChange(Number(v))}
            options={perPageSelectorOptions}
          />
        </div>
        {canLoadMore && onLoadMore && (
          <GlassButton size="sm" onClick={onLoadMore}>
            Load more
          </GlassButton>
        )}
        {onPageChange && totalPages > 1 && (
          <div className="flex items-center gap-1">
            <GlassButton
              size="sm"
              variant="secondary"
              icon="chevron-left"
              iconOnly={true}
              onClick={handlePrevPage}
              disabled={currentPage <= 1}
              aria-label="Go to previous page"
              className={cn({ 'cursor-not-allowed opacity-50': currentPage <= 1 })}
            />
            {isEditingPage ? (
              <div className="relative">
                <input
                  type="text"
                  value={tempPage}
                  onChange={handlePageChange}
                  onKeyDown={handlePageKeyDown}
                  onBlur={handlePageSubmit}
                  autoFocus
                  aria-label="Enter page number"
                  placeholder="Page"
                  className="bg-muted/30 border-muted/50 focus:ring-ring w-20 rounded-full border px-3 py-1.5 text-center text-sm focus:ring-2 focus:outline-none"
                />
              </div>
            ) : (
              <span
                className="bg-muted/30 hover:bg-muted/50 flex min-w-[80px] cursor-pointer items-center justify-center rounded-full px-3 py-1.5 text-sm transition-colors"
                onClick={handlePageClick}
                aria-label="Click to enter page number directly"
              >
                <span className="font-medium">{currentPage}</span>
                <span className="text-muted-foreground mx-1">/</span>
                <span className="text-muted-foreground">{totalPages}</span>
              </span>
            )}
            <GlassButton
              size="sm"
              variant="secondary"
              icon="chevron-right"
              iconOnly={true}
              onClick={handleNextPage}
              disabled={currentPage >= totalPages}
              aria-label="Go to next page"
              className={cn({ 'cursor-not-allowed opacity-50': currentPage >= totalPages })}
            />
          </div>
        )}
      </div>
    </div>
  );
};

// Memoize the component with custom comparison
export const PageControls = memo(PageControlsComponent, (prevProps, nextProps) => {
  return (
    prevProps.total === nextProps.total &&
    prevProps.visible === nextProps.visible &&
    prevProps.perPage === nextProps.perPage &&
    prevProps.className === nextProps.className &&
    prevProps.perPageOptions === nextProps.perPageOptions &&
    prevProps.onPerPageChange === nextProps.onPerPageChange &&
    prevProps.onLoadMore === nextProps.onLoadMore &&
    prevProps.currentPage === nextProps.currentPage &&
    prevProps.totalPages === nextProps.totalPages &&
    prevProps.onPageChange === nextProps.onPageChange
  );
});

PageControls.displayName = 'PageControls';
export default PageControls;
