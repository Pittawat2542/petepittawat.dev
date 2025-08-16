import FilterPanel from './ui/FilterPanel';

type Props = {
  q: string;
  setQ: (value: string) => void;
  filters: Record<string, string>;
  setFilters: (updater: (prev: Record<string, string>) => Record<string, string>) => void;
  filterOptions: Record<string, string[]>;
  placeholder?: string;
  filteredCount?: number;
};

export default function Filter({ 
  q, 
  setQ, 
  filters, 
  setFilters, 
  filterOptions, 
  placeholder = 'Search...', 
  filteredCount 
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
      compact={false}
    />
  );
}
