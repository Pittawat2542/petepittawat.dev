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
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={placeholder}
        className="w-full md:max-w-md rounded-md border border-[color:var(--white)]/15 bg-transparent px-3 py-2 text-sm"
      />
      <div className="flex gap-2">
        {Object.entries(filterOptions).map(([key, options]) => (
          <select
            title={`Filter by ${key}`}
            key={key}
            value={filters[key] || 'all'}
            onChange={(e) => setFilters((f) => ({ ...f, [key]: e.target.value }))}
            className="rounded-md border border-[color:var(--white)]/15 bg-transparent px-2 py-2 text-sm"
          >
            <option value="all">All {key}s</option>
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ))}
      </div>
    </div>
  );
}

