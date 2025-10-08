import { Menu, Search, X } from 'lucide-react';

import type { FC } from 'react';
import { memo, useCallback, useRef } from 'react';
import { openSearch } from '@/scripts/openSearch';

interface HeaderActionsProps {
  readonly mobileOpen: boolean;
  readonly onToggleMobile: () => void;
}

const HeaderActionsComponent: FC<HeaderActionsProps> = ({ mobileOpen, onToggleMobile }) => {
  const prefetchedRef = useRef(false);

  const prefetchSearchIndex = useCallback(() => {
    if (prefetchedRef.current) return;
    prefetchedRef.current = true;
    try {
      if (typeof navigator !== 'undefined') {
        const connection = (navigator as unknown as { connection?: { saveData?: boolean } })
          .connection;
        if (connection?.saveData) return;
      }
    } catch {}
    fetch('/search.json').catch(() => {});
  }, []);

  const handleSearchClick = useCallback(() => {
    prefetchSearchIndex();
    void openSearch();
  }, [prefetchSearchIndex]);

  const handlePrefetchIntent = useCallback(() => {
    prefetchSearchIndex();
  }, [prefetchSearchIndex]);

  return (
    <div className="relative ml-auto flex items-center gap-3 md:ml-0 md:flex md:flex-1 md:justify-end">
      {/* Desktop search button */}
      <button
        id="open-search-desktop"
        type="button"
        aria-label="Open search"
        title="Search (⌘/Ctrl + K)"
        className="relative hidden items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-2 text-sm font-medium text-white/85 transition-all duration-200 hover:scale-[1.03] hover:border-white/25 hover:bg-white/15 hover:text-white focus-visible:ring-2 focus-visible:ring-blue-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent focus-visible:outline-none active:scale-95 md:inline-flex"
        onClick={handleSearchClick}
        onMouseEnter={handlePrefetchIntent}
        onFocus={handlePrefetchIntent}
        onTouchStart={handlePrefetchIntent}
      >
        <Search className="h-5 w-5 opacity-85" aria-hidden="true" />
        <span className="hidden sm:inline">Search</span>
        <span className="ml-2 hidden items-center gap-1 rounded-md border border-white/15 px-1.5 py-0.5 text-[11px] text-white/70 lg:inline-flex">
          <span className="font-sans">⌘</span>K
        </span>
        <span className="sr-only">Open search</span>
      </button>

      {/* Mobile search button */}
      <button
        id="open-search-mobile"
        type="button"
        aria-label="Open search"
        title="Search"
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white/85 transition-all duration-200 hover:scale-105 hover:border-white/25 hover:bg-white/15 hover:text-white focus-visible:ring-2 focus-visible:ring-blue-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent focus-visible:outline-none active:scale-95 md:hidden"
        onClick={handleSearchClick}
        onMouseEnter={handlePrefetchIntent}
        onFocus={handlePrefetchIntent}
        onTouchStart={handlePrefetchIntent}
      >
        <Search className="h-5 w-5" aria-hidden="true" />
      </button>

      {/* Enhanced mobile menu toggle */}
      <button
        type="button"
        className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/80 backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:border-white/25 hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-blue-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent focus-visible:outline-none active:scale-95 md:hidden"
        aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-controls="mobile-nav-panel"
        aria-expanded={mobileOpen ? 'true' : 'false'}
        onClick={onToggleMobile}
      >
        <div className="relative">
          {mobileOpen ? (
            <X className="h-5 w-5 rotate-90 transition-transform duration-200" aria-hidden="true" />
          ) : (
            <Menu className="h-5 w-5 transition-transform duration-200" aria-hidden="true" />
          )}
        </div>
      </button>
    </div>
  );
};

// Memoize the component
export const HeaderActions = memo(HeaderActionsComponent, (prevProps, nextProps) => {
  return (
    prevProps.mobileOpen === nextProps.mobileOpen &&
    prevProps.onToggleMobile === nextProps.onToggleMobile
  );
});

HeaderActions.displayName = 'HeaderActions';
export default HeaderActions;
