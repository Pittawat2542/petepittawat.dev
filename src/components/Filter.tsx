import SearchInput from './ui/SearchInput';
import { ChevronDown } from 'lucide-react';

type Props = {
  q: string;
  setQ: (value: string) => void;
  filters: Record<string, string>;
  setFilters: (updater: (prev: Record<string, string>) => Record<string, string>) => void;
  filterOptions: Record<string, string[]>;
  placeholder?: string;
};

export default function Filter({ q, setQ, filters, setFilters, filterOptions, placeholder = 'Search...' }: Props) {
  return (
    <div className="flex flex-col md:flex-row gap-3 md:items-center">
      <SearchInput value={q} onChange={setQ} placeholder={placeholder} ariaLabel="Search" />
      {/* Filters */}
      <div className="-mx-1 px-1 flex gap-2 overflow-x-auto md:overflow-visible scrollbar-none md:flex-wrap">
        {Object.entries(filterOptions).map(([key, options]) => {
          const selected = filters[key] || 'all';
          const selectedLabel = selected === 'all' ? `All ${key}s` : selected;
          return (
          <label key={key} className="relative shrink-0 w-[60vw] max-w-[60vw] sm:w-auto sm:max-w-[18rem]">
            <span className="sr-only">Filter by {key}</span>
            <select
              title={`Filter by ${key}`}
              value={filters[key] || 'all'}
              onChange={(e) => setFilters((f) => ({ ...f, [key]: e.target.value }))}
              className="bg-transparent px-2 py-2 text-sm w-full truncate rounded-md border border-input text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring appearance-none pr-7"
              aria-label={`Filter by ${key}: ${selectedLabel}`}
              // Tooltip with full value on hover/long-press
              data-selected={selectedLabel}
              onFocus={(e) => (e.currentTarget.title = selectedLabel)}
              onMouseEnter={(e) => (e.currentTarget.title = selectedLabel)}
            >
              <option value="all">All {key}s</option>
              {options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 opacity-70" aria-hidden="true" />
          </label>
        );})}
      </div>
    </div>
  );
}
