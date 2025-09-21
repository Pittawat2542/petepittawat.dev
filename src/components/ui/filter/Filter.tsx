import type { FC } from 'react';
import { FilterPanel } from '@/components/ui/filter/FilterPanel';
import { memo } from 'react';

interface FilterProps {
  readonly q: string;
  readonly setQ: (value: string) => void;
  readonly filters: Readonly<Record<string, string>>;
  readonly setFilters: (updater: (prev: Record<string, string>) => Record<string, string>) => void;
  readonly filterOptions: Readonly<Record<string, readonly string[]>>;
  readonly placeholder?: string;
  readonly filteredCount?: number;
  // Optional sorting controls
  readonly sortOptions?: Array<{ readonly value: string; readonly label: string }>;
  readonly sortValue?: string;
  readonly onSortChange?: (value: string) => void;
}

const FilterComponent: FC<FilterProps> = ({ 
  q, 
  setQ, 
  filters, 
  setFilters, 
  filterOptions, 
  placeholder = 'Search...', 
  filteredCount,
  sortOptions,
  sortValue,
  onSortChange,
}) => {
  return (
    <FilterPanel
      searchValue={q}
      onSearchChange={setQ}
      searchPlaceholder={placeholder}
      filters={filters}
      onFiltersChange={setFilters}
      filterOptions={filterOptions}
      filteredResults={filteredCount || 0}
      sortOptions={sortOptions || []}
      sortValue={sortValue || ''}
      onSortChange={onSortChange || (() => {})}
      compact={true}
    />
  );
};

// Memoized component for performance optimization
export const Filter = memo(FilterComponent);
Filter.displayName = 'Filter';

// Default export for backward compatibility
export default Filter;
