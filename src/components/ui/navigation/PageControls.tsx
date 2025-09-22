/* eslint-disable */
import type { FC, KeyboardEvent } from 'react';
import { memo, useEffect, useState } from 'react';

import GlassButton from './GlassButton';
import Selector from '../interaction/Selector';

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
  className = '', 
  perPageOptions = [6, 12, 24, 48],
  currentPage = 1,
  totalPages = 1,
  onPageChange
}) => {
  const [isEditingPage, setIsEditingPage] = useState(false);
  const [tempPage, setTempPage] = useState(currentPage?.toString() || '1');

  // Auto-scroll to top when page changes
  useEffect(() => {
    if (currentPage && typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentPage]);

  const handlePageClick = () => {
    setIsEditingPage(true);
    setTempPage(currentPage?.toString() || '1');
  };

  const handlePageSubmit = () => {
    const page = parseInt(tempPage, 10);
    if (!isNaN(page) && page >= 1 && page <= (totalPages || 1) && onPageChange) {
      onPageChange(page);
    }
    setIsEditingPage(false);
  };

  const handlePageKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handlePageSubmit();
    } else if (e.key === 'Escape') {
      setIsEditingPage(false);
    }
  };

  const handlePageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numeric input
    if (value === '' || /^\d+$/.test(value)) {
      setTempPage(value);
    }
  };

  const handlePrevPage = () => {
    if (currentPage && currentPage > 1 && onPageChange) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage && currentPage < (totalPages || 1) && onPageChange) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className={`flex items-center justify-between gap-3 ${className}`}>
      <div className="text-sm text-muted-foreground">
        Showing <span className="font-medium text-foreground">{visible}</span> of <span className="font-medium text-foreground">{total}</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Per page:</span>
          <Selector
            label="Items per page"
            value={String(perPage)}
            onChange={(v) => onPerPageChange(Number(v))}
            options={perPageOptions.map((n) => ({ value: String(n), label: String(n) }))}
          />
        </div>
        {onLoadMore && visible < total && (
          <GlassButton size="sm" onClick={onLoadMore}>Load more</GlassButton>
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
              className={currentPage <= 1 ? 'opacity-50 cursor-not-allowed' : ''}
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
                  className="w-20 px-3 py-1.5 text-sm bg-muted/30 border border-muted/50 rounded-full text-center focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            ) : (
              <span 
                className="flex items-center px-3 text-sm bg-muted/30 rounded-full py-1.5 min-w-[80px] justify-center cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={handlePageClick}
                aria-label="Click to enter page number directly"
              >
                <span className="font-medium">{currentPage}</span>
                <span className="mx-1 text-muted-foreground">/</span>
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
              className={currentPage >= totalPages ? 'opacity-50 cursor-not-allowed' : ''}
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