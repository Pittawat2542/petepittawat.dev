import Filter from './Filter';
import type { Publication } from '../types';
import PublicationCard from './ui/PublicationCard';
import { useDataFilter } from '../lib/hooks';

type Props = { items: Publication[] };

export default function PublicationsExplorer({ items }: Props) {
  const { q, setQ, filters, setFilters, filtered, filterOptions } = useDataFilter(items, {
    searchFields: (item) => [item.title, item.authors, item.venue, item.type],
    filterFields: {
      type: (item) => item.type,
      year: (item) => item.year.toString(),
      tag: (item) => item.tags,
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <Filter
        q={q}
        setQ={setQ}
        filters={filters}
        setFilters={setFilters}
        filterOptions={filterOptions}
        placeholder="Search title, authors, venue..."
      />
      <div className="grid gap-3">
        {filtered.map((item, i) => (
          <PublicationCard key={`${item.title}-${item.year}`} item={item} />
        ))}
        {!filtered.length && <p className="text-sm text-[color:var(--white)]/60">No results.</p>}
      </div>
    </div>
  );
}
