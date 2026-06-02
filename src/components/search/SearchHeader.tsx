import '@/styles/components/search-modal.css';

import type { SearchItemType } from './types';

import { X } from 'lucide-react';
import type { FC } from 'react';
import { RecentSearches } from './RecentSearches';
import { SearchFilterChips } from './SearchFilterChips';
import SearchInput from '@/components/ui/interaction/SearchInput';
import { DialogClose } from '@/components/ui/core/dialog';
import { memo } from 'react';

interface SearchHeaderProps {
  readonly query: string;
  readonly onQueryChange: (query: string) => void;
  readonly typeFilter: Set<SearchItemType>;
  readonly countsByType: Map<SearchItemType, number>;
  readonly onToggleType: (type: SearchItemType) => void;
  readonly onSelectAllTypes: () => void;
  readonly showRecent: boolean;
  readonly recent: readonly string[];
  readonly onSelectFromRecent: (value: string) => void;
  readonly onClearRecent: () => void;
}

const SearchHeaderComponent: FC<SearchHeaderProps> = ({
  query,
  onQueryChange,
  typeFilter,
  countsByType,
  onToggleType,
  onSelectAllTypes,
  showRecent,
  recent,
  onSelectFromRecent,
  onClearRecent,
}) => {
  return (
    <div className="border-border border-b p-4 md:p-5 lg:p-6">
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <SearchInput
            value={query}
            onChange={onQueryChange}
            placeholder="Search posts, projects, publications, talks..."
            ariaLabel="Universal search"
            size="lg"
          />
        </div>
        <DialogClose className="search-modal__close" aria-label="Close search" title="Close (Esc)">
          <span className="sr-only">Close</span>
          <X size={16} />
        </DialogClose>
      </div>

      <SearchFilterChips
        activeTypes={typeFilter}
        counts={countsByType}
        onToggle={onToggleType}
        onSelectAll={onSelectAllTypes}
      />

      {showRecent && (
        <RecentSearches recent={recent} onSelect={onSelectFromRecent} onClear={onClearRecent} />
      )}
    </div>
  );
};

// Memoize the component with custom comparison
export const SearchHeader = memo(SearchHeaderComponent, (prevProps, nextProps) => {
  return (
    prevProps.query === nextProps.query &&
    prevProps.typeFilter === nextProps.typeFilter &&
    prevProps.countsByType === nextProps.countsByType &&
    prevProps.showRecent === nextProps.showRecent &&
    prevProps.recent === nextProps.recent &&
    prevProps.onQueryChange === nextProps.onQueryChange &&
    prevProps.onToggleType === nextProps.onToggleType &&
    prevProps.onSelectAllTypes === nextProps.onSelectAllTypes &&
    prevProps.onSelectFromRecent === nextProps.onSelectFromRecent &&
    prevProps.onClearRecent === nextProps.onClearRecent
  );
});

SearchHeader.displayName = 'SearchHeader';
export default SearchHeader;
