import type { FC, ReactNode } from 'react';
import { memo } from 'react';
import { cn } from '@/lib/utils';

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
  readonly toolbarAccessory?: ReactNode;
  readonly tone?: 'default' | 'editorial' | undefined;
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
  toolbarAccessory,
  tone = 'default',
}) => {
  const shouldShowToggle = compact && (hasDropdownFilters || hasTags) && onToggleFilters;
  const canSort = Boolean(onSortChange);
  const hasTools = Boolean(toolbarAccessory || (canSort && onSortChange));

  return (
    <div
      className={cn(
        'flex flex-col gap-3 md:flex-row md:items-center md:justify-between',
        tone === 'editorial' && 'gap-4'
      )}
    >
      <div
        className={cn(
          'flex flex-1 items-center gap-3',
          tone === 'editorial' && 'flex-col items-stretch sm:flex-row sm:items-center'
        )}
      >
        <SearchInput
          value={searchValue}
          onChange={onSearchChange}
          placeholder={searchPlaceholder}
          className="min-w-0 flex-1"
          tone={tone}
        />

        {shouldShowToggle && (
          <FilterToggle
            showFilters={showFilters}
            onToggle={onToggleFilters}
            activeFiltersCount={activeFiltersCount}
            tone={tone}
          />
        )}
      </div>

      <div
        className={cn(
          'flex flex-wrap items-center gap-2 sm:gap-4',
          tone === 'editorial' && 'grid items-center gap-3 md:grid-cols-[minmax(0,1fr)_auto]'
        )}
      >
        {hasTools && (
          <div
            className={cn(
              'flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-start',
              tone === 'editorial' && 'flex-wrap items-center gap-3 md:w-full md:justify-start'
            )}
          >
            {toolbarAccessory}
            {canSort && onSortChange && (
              <SortControl
                sortOptions={sortOptions}
                sortValue={sortValue}
                onSortChange={onSortChange}
                tone={tone}
              />
            )}
          </div>
        )}

        <ResultsInfo
          totalResults={totalResults ?? 0}
          filteredResults={filteredResults}
          searchValue={searchValue}
          hasActiveFilters={hasActiveFilters}
          tone={tone}
        />
      </div>
    </div>
  );
};

export const FilterPanelHeader = memo(FilterPanelHeaderComponent);
FilterPanelHeader.displayName = 'FilterPanelHeader';
