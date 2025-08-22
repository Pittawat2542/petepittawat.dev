import FilterPanel from './ui/FilterPanel';

type Props = {
  q: string;
  setQ: (value: string) => void;
  filters: Record<string, string>;
  setFilters: (updater: (prev: Record<string, string>) => Record<string, string>) => void;
  filterOptions: Record<string, string[]>;
  placeholder?: string;
  filteredCount?: number;
  // Optional sorting controls
  sortOptions?: Array<{ value: string; label: string }>;
  sortValue?: string;
  onSortChange?: (value: string) => void;
};

export default function Filter({ 
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
}: Props) {
  return (
    <FilterPanel
      searchValue={q}
      onSearchChange={setQ}
      searchPlaceholder={placeholder}
      filters={filters}
      onFiltersChange={setFilters}
      filterOptions={filterOptions}
      filteredResults={filteredCount}
      sortOptions={sortOptions}
      sortValue={sortValue}
      onSortChange={onSortChange}
      compact={true}
    />
  );
}
