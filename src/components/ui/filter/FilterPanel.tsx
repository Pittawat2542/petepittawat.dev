import { memo, useState } from 'react';

import { ActiveFiltersSummary } from './ActiveFiltersSummary';
import { DropdownFilters } from './DropdownFilters';
import type { FC } from 'react';
// Import extracted components
import { FilterToggle } from './FilterToggle';
import { ResultsInfo } from './ResultsInfo';
import SearchInput from '@/components/ui/interaction/SearchInput';
import { SortControl } from './SortControl';
import { TagFilters } from './TagFilters';

interface FilterPanelProps {
  // Search
  readonly searchValue: string;
  readonly onSearchChange: (value: string) => void;
  readonly searchPlaceholder?: string | undefined;

  // Dropdown filters
  readonly filters?: Record<string, string> | undefined;
  readonly onFiltersChange?:
    | ((updater: (prev: Record<string, string>) => Record<string, string>) => void)
    | undefined;
  readonly filterOptions?: Record<string, readonly string[]> | undefined;

  // Tag filters
  readonly availableTags?: readonly string[] | undefined;
  readonly selectedTags?: Set<string> | undefined;
  readonly onTagsChange?: ((updater: (prev: Set<string>) => Set<string>) => void) | undefined;
  readonly tagCounts?: Record<string, number> | undefined;

  // Sort
  readonly sortOptions?: Array<{ readonly value: string; readonly label: string }> | undefined;
  readonly sortValue?: string | undefined;
  readonly onSortChange?: ((value: string) => void) | undefined;

  // Results info
  readonly totalResults?: number | undefined;
  readonly filteredResults?: number | undefined;

  // Layout
  readonly className?: string | undefined;
  readonly compact?: boolean | undefined;
}

const FilterPanelComponent: FC<FilterPanelProps> = ({
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search...',
  filters = {},
  onFiltersChange,
  filterOptions = {},
  availableTags = [],
  selectedTags,
  onTagsChange,
  tagCounts = {},
  sortOptions = [],
  sortValue,
  onSortChange,
  totalResults,
  filteredResults,
  className = '',
  compact = false,
}) => {
  const [showFilters, setShowFilters] = useState(!compact);

  const hasDropdownFilters = Object.keys(filterOptions).length > 0;
  const hasTags = availableTags.length > 0;
  const hasActiveFilters =
    Object.values(filters).some(v => v !== 'all' && v !== '') ||
    (selectedTags && selectedTags.size > 0);

  const activeDropdownEntries = Object.entries(filters).filter(([, v]) => v !== 'all' && v !== '');
  const activeTags = selectedTags ? Array.from(selectedTags) : [];

  const activeCount = activeDropdownEntries.length + activeTags.length;

  const clearAllFilters = () => {
    if (onFiltersChange) {
      onFiltersChange(() => ({}));
    }
    if (onTagsChange) {
      onTagsChange(() => new Set());
    }
    onSearchChange('');
  };

  const removeDropdownFilter = (key: string) => {
    onFiltersChange?.(f => {
      const n = { ...f };
      delete n[key];
      return n;
    });
  };

  const removeTag = (tag: string) => {
    onTagsChange?.(prev => {
      const next = new Set(prev);
      next.delete(tag);
      return next;
    });
  };

  const toggleTag = (tag: string) => {
    if (!onTagsChange || !selectedTags) return;

    if (tag === 'All') {
      onTagsChange(() => new Set());
      return;
    }

    onTagsChange(prev => {
      const next = new Set(prev);
      if (next.has(tag)) {
        next.delete(tag);
      } else {
        next.add(tag);
      }
      return next;
    });
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main search and controls row */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center gap-3">
          <SearchInput
            value={searchValue}
            onChange={onSearchChange}
            placeholder={searchPlaceholder}
            className="flex-1"
          />

          {compact && (hasDropdownFilters || hasTags) && (
            <FilterToggle
              showFilters={showFilters}
              onToggle={() => setShowFilters(!showFilters)}
              activeFiltersCount={activeCount}
            />
          )}
        </div>

        {/* Sort and results info */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          {onSortChange && (
            <SortControl
              sortOptions={sortOptions}
              sortValue={sortValue}
              onSortChange={onSortChange}
            />
          )}

          <ResultsInfo
            totalResults={totalResults || 0}
            filteredResults={filteredResults}
            searchValue={searchValue}
            hasActiveFilters={!!hasActiveFilters}
          />
        </div>
      </div>

      {/* Compact active filters summary row (when collapsed) */}
      {compact && !showFilters && hasActiveFilters && (
        <ActiveFiltersSummary
          activeDropdownEntries={activeDropdownEntries}
          activeTags={activeTags}
          onClearAll={clearAllFilters}
          onRemoveDropdownFilter={removeDropdownFilter}
          onRemoveTag={removeTag}
        />
      )}

      {/* Expandable filters section */}
      {showFilters && (hasDropdownFilters || hasTags || hasActiveFilters) && (
        <div className="glass-card animate-in fade-in-0 slide-in-from-top-2 space-y-4 rounded-2xl p-4 duration-300">
          {/* Dropdown filters */}
          {hasDropdownFilters && onFiltersChange && (
            <DropdownFilters
              filterOptions={filterOptions}
              filters={filters}
              onFiltersChange={onFiltersChange}
              hasActiveFilters={!!hasActiveFilters}
              onClearAll={clearAllFilters}
            />
          )}

          {/* Tag filters */}
          {hasTags && selectedTags && (
            <TagFilters
              availableTags={availableTags}
              selectedTags={selectedTags}
              tagCounts={tagCounts}
              onToggleTag={toggleTag}
            />
          )}
        </div>
      )}
    </div>
  );
};

export const FilterPanel = memo(FilterPanelComponent);
FilterPanel.displayName = 'FilterPanel';
export default FilterPanel;
