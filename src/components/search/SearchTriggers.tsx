import { Command, Search as SearchIcon } from 'lucide-react';

import { DialogTrigger } from '@/components/ui/core/dialog';
import type { FC } from 'react';
import { cn } from '@/lib/utils';
import { memo } from 'react';

interface SearchTriggersProps {
  readonly hideTriggers?: boolean;
}

const SearchTriggersComponent: FC<SearchTriggersProps> = ({ hideTriggers = false }) => {
  if (hideTriggers) return null;

  return (
    <>
      {/* Desktop trigger */}
      <DialogTrigger asChild>
        <button
          className={cn(
            'hidden md:inline-flex items-center gap-2 rounded-full px-3 py-2',
            'text-sm hover:bg-[color:var(--white)]/5 transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--white)]/30'
          )}
          aria-label="Open search"
          title="Search (⌘/Ctrl + K)"
        >
          <SearchIcon size={16} className="opacity-80" />
          <span className="opacity-90">Search</span>
          <span className="ml-2 hidden lg:inline-flex items-center gap-1 rounded-md border border-white/10 px-1.5 py-0.5 text-xs text-white/70">
            <Command size={12} />K
          </span>
        </button>
      </DialogTrigger>

      {/* Mobile trigger */}
      <DialogTrigger asChild>
        <button
          className={cn(
            'md:hidden inline-flex items-center justify-center rounded-full p-2',
            'hover:bg-[color:var(--white)]/10 focus-visible:outline-none',
            'focus-visible:ring-2 focus-visible:ring-[color:var(--white)]/30'
          )}
          aria-label="Open search"
          title="Search"
        >
          <SearchIcon size={18} className="opacity-90" />
        </button>
      </DialogTrigger>
    </>
  );
};

// Memoize the component
export const SearchTriggers = memo(SearchTriggersComponent);
SearchTriggers.displayName = 'SearchTriggers';
export default SearchTriggers;