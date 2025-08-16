import Filter from './Filter';
import type { Publication } from '../types';
import PublicationCard from './ui/PublicationCard';
import { useDataFilter } from '../lib/hooks';
import { useEffect } from 'react';

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

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const qParam = params.get('q');
      if (qParam) setQ(qParam);
    } catch {}
  }, [setQ]);

  const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  return (
    <div className="flex flex-col gap-4">
      <Filter
        q={q}
        setQ={setQ}
        filters={filters}
        setFilters={setFilters}
        filterOptions={filterOptions}
        placeholder="Search title, authors, venue..."
        filteredCount={filtered.length}
      />
      <div className="grid grid-cols-1 gap-3">
        {filtered.map((item, i) => (
          <div id={`pub-${slugify(item.title)}-${item.year}`} key={`${item.title}-${item.year}`} className="stagger-fade-in target-highlight" style={{ animationDelay: `${Math.min(i * 100, 800)}ms` }}>
            <PublicationCard item={item} />
          </div>
        ))}
        {!filtered.length && <p className="text-sm text-[color:var(--white)]/60">No results.</p>}
      </div>
    </div>
  );
}
