import { Menu, Search, X } from 'lucide-react';

import type { FC } from 'react';
import { memo } from 'react';
import { openSearch } from '@/scripts/openSearch';

interface HeaderActionsProps {
  readonly mobileOpen: boolean;
  readonly onToggleMobile: () => void;
}

const HeaderActionsComponent: FC<HeaderActionsProps> = ({ mobileOpen, onToggleMobile }) => {
  return (
    <div className="relative ml-auto flex items-center gap-3 md:ml-0 md:flex md:flex-1 md:justify-end">
      {/* Enhanced search button */}
      <button 
        id="search-button" 
        onClick={openSearch}
        title="Search"
        className="relative flex items-center gap-3 rounded-full px-3 py-2 text-white/80 transition-all duration-200 hover:text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent hover:scale-105 active:scale-95"
      >
        <Search className="h-5 w-5 transition-transform duration-200" aria-hidden="true" />
        <span className="sr-only">Search</span>
      </button>
      
      {/* Enhanced mobile menu toggle */}
      <button
        type="button"
        className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/80 transition-all duration-200 hover:text-white hover:bg-white/10 hover:border-white/25 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent md:hidden backdrop-blur-sm"
        aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-controls="mobile-nav-panel"
        aria-expanded={mobileOpen ? 'true' : 'false'}
        onClick={onToggleMobile}
      >
        <div className="relative">
          {mobileOpen ? (
            <X className="h-5 w-5 transition-transform duration-200 rotate-90" aria-hidden="true" />
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