import { CornerDownLeft } from 'lucide-react';
import { RecentSearches } from './RecentSearches';
import { SearchFilterChips } from './SearchFilterChips';
import SearchInput from '../ui/SearchInput';
import type { SearchItemType } from './types';

interface SearchHeaderProps {
  query: string;
  onQueryChange: (query: string) => void;
  filtered: any[];
  typeFilter: Set<SearchItemType>;
  countsByType: Map<SearchItemType, number>;
  onToggleType: (type: SearchItemType) => void;
  onSelectAllTypes: () => void;
  showRecent: boolean;
  recent: string[];
  onSelectFromRecent: (value: string) => void;
  onClearRecent: () => void;
}

export function SearchHeader({
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
}: Readonly<SearchHeaderProps>) {
  return (
    <div className="p-4 md:p-5 lg:p-6 border-b border-border">
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
      
      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground" aria-live="polite">
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
        <RecentSearches
          recent={recent}
          onSelect={onSelectFromRecent}
          onClear={onClearRecent}
        />
      )}
    </div>
  );
}