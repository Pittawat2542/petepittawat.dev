import type { FC } from 'react';
import { memo } from 'react';

import SearchInput from '@/components/ui/interaction/SearchInput';

import { FilterToggle } from './FilterToggle';
import { ResultsInfo } from './ResultsInfo';
import { SortControl } from './SortControl';

interface FilterPanelHeaderProps {
  readonly searchValue: string;
  readonly onSearchChange: (value: string) => void;
  readonly searchPlaceholder: string;
  readonly compact: boolean;
  readonly hasDropdownFilters: boolean;
  readonly hasTags: boolean;
  readonly showFilters: boolean;
  readonly onToggleFilters?: (() => void) | undefined;
  readonly activeFiltersCount: number;
  readonly sortOptions: ReadonlyArray<{ readonly value: string; readonly label: string }>;
  readonly sortValue?: string | undefined;
  readonly onSortChange?: ((value: string) => void) | undefined;
  readonly totalResults?: number | undefined;
  readonly filteredResults?: number | undefined;
  readonly hasActiveFilters: boolean;
}

const FilterPanelHeaderComponent: FC<FilterPanelHeaderProps> = ({
  searchValue,
  onSearchChange,
  searchPlaceholder,
  compact,
  hasDropdownFilters,
  hasTags,
  showFilters,
  onToggleFilters,
  activeFiltersCount,
  sortOptions,
  sortValue,
  onSortChange,
  totalResults,
  filteredResults,
  hasActiveFilters,
}) => {
  const shouldShowToggle = compact && (hasDropdownFilters || hasTags) && onToggleFilters;
  const canSort = Boolean(onSortChange);

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-1 items-center gap-3">
        <SearchInput
          value={searchValue}
          onChange={onSearchChange}
          placeholder={searchPlaceholder}
          className="flex-1"
        />

        {shouldShowToggle && (
          <FilterToggle
            showFilters={showFilters}
            onToggle={onToggleFilters}
            activeFiltersCount={activeFiltersCount}
          />
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:gap-4">
        {canSort && onSortChange && (
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
          hasActiveFilters={hasActiveFilters}
        />
      </div>
    </div>
  );
};

export const FilterPanelHeader = memo(FilterPanelHeaderComponent);
FilterPanelHeader.displayName = 'FilterPanelHeader';
