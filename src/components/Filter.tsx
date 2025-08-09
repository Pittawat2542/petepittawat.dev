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
      {/* Search field with icon */}
      <label className="relative w-full md:max-w-md" aria-label="Search">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="absolute left-3 top-1/2 -translate-y-1/2 opacity-70"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.3-4.3"></path>
        </svg>
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={placeholder}
          className="input-glass w-full pl-9 pr-3 py-2 text-sm bg-transparent"
        />
      </label>
      {/* Filters */}
      <div className="flex gap-2">
        {Object.entries(filterOptions).map(([key, options]) => (
          <label key={key} className="relative">
            <span className="sr-only">Filter by {key}</span>
            <select
              title={`Filter by ${key}`}
              value={filters[key] || 'all'}
              onChange={(e) => setFilters((f) => ({ ...f, [key]: e.target.value }))}
              className="select-glass bg-transparent px-2 py-2 text-sm"
            >
              <option value="all">All {key}s</option>
              {options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 opacity-70"
              aria-hidden="true"
            >
              <path d="m7 10 5 5 5-5"></path>
            </svg>
          </label>
        ))}
      </div>
    </div>
  );
}
