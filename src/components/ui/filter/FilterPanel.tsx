import type { FC } from 'react';
import { memo, useCallback, useMemo, useState } from 'react';

import { cn } from '@/lib/utils';

import { ActiveFiltersSummary } from './ActiveFiltersSummary';
import { FilterPanelBody } from './FilterPanelBody';
import { FilterPanelHeader } from './FilterPanelHeader';

const EMPTY_FILTERS: Record<string, string> = Object.freeze({});
const EMPTY_FILTER_OPTIONS: Record<string, readonly string[]> = Object.freeze({});
const EMPTY_TAGS: readonly string[] = Object.freeze([]);
const EMPTY_TAG_COUNTS: Record<string, number> = Object.freeze({});
const EMPTY_SORT_OPTIONS: ReadonlyArray<{ readonly value: string; readonly label: string }> =
  Object.freeze([]);

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
  readonly sortOptions?:
    | ReadonlyArray<{ readonly value: string; readonly label: string }>
    | undefined;
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
  className,
  compact = false,
}) => {
  const [showFilters, setShowFilters] = useState(!compact);
  const currentFilters = filters ?? EMPTY_FILTERS;
  const currentFilterOptions = filterOptions ?? EMPTY_FILTER_OPTIONS;
  const currentAvailableTags = availableTags ?? EMPTY_TAGS;
  const currentTagCounts = tagCounts ?? EMPTY_TAG_COUNTS;
  const currentSortOptions = sortOptions ?? EMPTY_SORT_OPTIONS;
  const currentSelectedTags = selectedTags ?? null;

  const filterStats = useMemo(() => {
    const activeDropdownEntries = Object.entries(currentFilters).filter(
      ([, v]) => v !== 'all' && v !== ''
    );
    const activeTags = currentSelectedTags ? Array.from(currentSelectedTags) : [];
    const hasDropdownFilters = Object.keys(currentFilterOptions).length > 0;
    const hasTags = currentAvailableTags.length > 0;
    const hasActiveFilters = activeDropdownEntries.length > 0 || Boolean(currentSelectedTags?.size);

    return {
      hasDropdownFilters,
      hasTags,
      hasActiveFilters,
      activeDropdownEntries,
      activeTags,
      activeCount: activeDropdownEntries.length + activeTags.length,
    };
  }, [currentFilters, currentSelectedTags, currentFilterOptions, currentAvailableTags]);

  const {
    hasDropdownFilters,
    hasTags,
    hasActiveFilters,
    activeDropdownEntries,
    activeTags,
    activeCount,
  } = filterStats;

  const clearAllFilters = useCallback(() => {
    onFiltersChange?.(() => ({}));
    onTagsChange?.(() => new Set<string>());
    onSearchChange('');
  }, [onFiltersChange, onTagsChange, onSearchChange]);

  const removeDropdownFilter = useCallback(
    (key: string) => {
      onFiltersChange?.(f => {
        const next = { ...f };
        delete next[key];
        return next;
      });
    },
    [onFiltersChange]
  );

  const removeTag = useCallback(
    (tag: string) => {
      onTagsChange?.((prev: Set<string>) => {
        const next = new Set(prev);
        next.delete(tag);
        return next;
      });
    },
    [onTagsChange]
  );

  const toggleTag = useCallback(
    (tag: string) => {
      if (!onTagsChange || !currentSelectedTags) {
        return;
      }

      if (tag === 'All') {
        onTagsChange(() => new Set<string>());
        return;
      }

      onTagsChange((prev: Set<string>) => {
        const next = new Set(prev);
        if (next.has(tag)) {
          next.delete(tag);
        } else {
          next.add(tag);
        }
        return next;
      });
    },
    [onTagsChange, currentSelectedTags]
  );

  const handleToggleFilters = useCallback(() => {
    setShowFilters(prev => !prev);
  }, []);

  return (
    <div className={cn('space-y-4', className)}>
      <FilterPanelHeader
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        searchPlaceholder={searchPlaceholder}
        compact={compact}
        hasDropdownFilters={hasDropdownFilters}
        hasTags={hasTags}
        showFilters={showFilters}
        onToggleFilters={handleToggleFilters}
        activeFiltersCount={activeCount}
        sortOptions={currentSortOptions}
        sortValue={sortValue}
        onSortChange={onSortChange}
        totalResults={totalResults}
        filteredResults={filteredResults}
        hasActiveFilters={hasActiveFilters}
      />

      {compact && !showFilters && hasActiveFilters && (
        <ActiveFiltersSummary
          activeDropdownEntries={activeDropdownEntries}
          activeTags={activeTags}
          onClearAll={clearAllFilters}
          onRemoveDropdownFilter={removeDropdownFilter}
          onRemoveTag={removeTag}
        />
      )}

      <FilterPanelBody
        showFilters={showFilters}
        hasDropdownFilters={hasDropdownFilters}
        hasTags={hasTags}
        hasActiveFilters={hasActiveFilters}
        filterOptions={currentFilterOptions}
        filters={currentFilters}
        onFiltersChange={onFiltersChange}
        onClearAll={clearAllFilters}
        availableTags={currentAvailableTags}
        selectedTags={currentSelectedTags}
        tagCounts={currentTagCounts}
        onToggleTag={toggleTag}
      />
    </div>
  );
};

export const FilterPanel = memo(FilterPanelComponent);
FilterPanel.displayName = 'FilterPanel';
export default FilterPanel;
