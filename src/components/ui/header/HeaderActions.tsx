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
    <div className="relative ml-auto flex items-center gap-2 md:ml-0 md:flex md:flex-1 md:justify-end">
      <button 
        id="search-button" 
        onClick={openSearch}
        title="Search"
        className="relative flex items-center gap-3 rounded-full px-2 py-1 text-white transition-colors hover:text-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent,#6AC1FF)]/60"
      >
        <Search className="h-5 w-5 opacity-80" aria-hidden="true" />
      </button>
      <button
        type="button"
        className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-white/80 transition-all hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent,#6AC1FF)]/60 md:hidden"
        aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-controls="mobile-nav-panel"
        aria-expanded={mobileOpen ? 'true' : 'false'}
        onClick={onToggleMobile}
      >
        {mobileOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
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