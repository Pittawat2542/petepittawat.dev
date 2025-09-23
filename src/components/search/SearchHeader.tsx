import type { SearchItem, SearchItemType } from './types';

import { CornerDownLeft } from 'lucide-react';
import type { FC } from 'react';
import { RecentSearches } from './RecentSearches';
import { SearchFilterChips } from './SearchFilterChips';
import SearchInput from '@/components/ui/interaction/SearchInput';
import { memo } from 'react';

interface SearchHeaderProps {
  readonly query: string;
  readonly onQueryChange: (query: string) => void;
  readonly filtered: readonly SearchItem[];
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
  filtered,
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
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <SearchInput
            value={query}
            onChange={onQueryChange}
            placeholder="Search posts, projects, publications, talks..."
            ariaLabel="Universal search"
            size="lg"
          />
        </div>
      </div>

      <div
        className="text-muted-foreground mt-3 flex items-center justify-between text-xs"
        aria-live="polite"
      >
        <div className="flex items-center gap-1.5">
          <span className="hidden sm:inline">Navigate with</span>
          <kbd className="rounded border px-1 py-0.5">↑</kbd>
          <kbd className="rounded border px-1 py-0.5">↓</kbd>
          <span className="inline-flex items-center gap-1">
            <CornerDownLeft size={12} /> Enter
          </span>
          <span className="hidden sm:inline">• Esc to close</span>
        </div>
        <div>{filtered.length} results</div>
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
    prevProps.filtered === nextProps.filtered &&
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
