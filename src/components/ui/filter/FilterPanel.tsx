import { memo, useState } from 'react';
import type { FC } from 'react';
import { cn } from '@/lib/utils';
import { ActiveFiltersSummary } from './ActiveFiltersSummary';
import { FilterPanelBody } from './FilterPanelBody';
import { FilterPanelHeader } from './FilterPanelHeader';
import {
  deriveFilterTotals,
  EMPTY_FILTERS,
  EMPTY_FILTER_OPTIONS,
  EMPTY_SORT_OPTIONS,
  EMPTY_TAG_COUNTS,
  EMPTY_TAGS,
} from './filterPanelUtils';

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

const FilterPanelComponent: FC<FilterPanelProps> = props => {
  const {
    searchValue,
    onSearchChange,
    searchPlaceholder = 'Search...',
    filters = EMPTY_FILTERS,
    onFiltersChange,
    filterOptions = EMPTY_FILTER_OPTIONS,
    availableTags = EMPTY_TAGS,
    selectedTags,
    onTagsChange,
    tagCounts = EMPTY_TAG_COUNTS,
    sortOptions = EMPTY_SORT_OPTIONS,
    sortValue,
    onSortChange,
    totalResults,
    filteredResults,
    className,
    compact = false,
  } = props;

  const [showFilters, setShowFilters] = useState(!compact);
  const currentSelectedTags = selectedTags ?? null;

  const {
    hasDropdownFilters,
    hasTags,
    hasActiveFilters,
    activeDropdownEntries,
    activeTags,
    activeCount,
  } = deriveFilterTotals(filters, filterOptions, availableTags, currentSelectedTags);

  const clearAllFilters = () => {
    onFiltersChange?.(() => ({}));
    onTagsChange?.(() => new Set<string>());
    onSearchChange('');
  };

  const removeDropdownFilter = (key: string) => {
    onFiltersChange?.(prev => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const removeTag = (tag: string) => {
    onTagsChange?.((prev: Set<string>) => {
      const next = new Set(prev);
      next.delete(tag);
      return next;
    });
  };

  const toggleTag = (tag: string) => {
    if (!onTagsChange || !currentSelectedTags) return;

    if (tag === 'All') {
      onTagsChange(() => new Set<string>());
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

  const handleToggleFilters = () => {
    setShowFilters(prev => !prev);
  };

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
        sortOptions={sortOptions}
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
        filterOptions={filterOptions}
        filters={filters}
        onFiltersChange={onFiltersChange}
        onClearAll={clearAllFilters}
        availableTags={availableTags}
        selectedTags={currentSelectedTags}
        tagCounts={tagCounts}
        onToggleTag={toggleTag}
      />
    </div>
  );
};

export const FilterPanel = memo(FilterPanelComponent);
FilterPanel.displayName = 'FilterPanel';
export default FilterPanel;
