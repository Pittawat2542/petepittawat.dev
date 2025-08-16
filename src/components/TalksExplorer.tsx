import { useEffect, useMemo } from 'react';
import TalkCard from './ui/TalkCard';
import { useDataFilter } from '../lib/hooks';
import type { Talk } from '../types';
import Filter from './Filter';

type Props = { items: Talk[] };

export default function TalksExplorer({ items }: Props) {
  const { q, setQ, filters, setFilters, filtered, filterOptions } = useDataFilter(items, {
    searchFields: (item) => [item.title, item.audience, item.mode],
    filterFields: {
      mode: (item) => item.mode,
      year: (item) => new Date(item.date).getFullYear().toString(),
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

  // Sort filtered items by date
  const sortedFiltered = useMemo(() => 
    [...filtered].sort((a, b) => +new Date(b.date) - +new Date(a.date)),
    [filtered]
  );

  const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  return (
    <div className="flex flex-col gap-4">
      <Filter
        q={q}
        setQ={setQ}
        filters={filters}
        setFilters={setFilters}
        filterOptions={filterOptions}
        placeholder="Search title, audience..."
        filteredCount={sortedFiltered.length}
      />
      <div className="grid gap-3">
        {sortedFiltered.map((item, i) => (
          <div id={`talk-${slugify(item.title)}-${new Date(item.date).getFullYear()}`} key={`${item.title}-${item.date}`} className="stagger-fade-in target-highlight" style={{ animationDelay: `${Math.min(i * 100, 800)}ms` }}>
            <TalkCard item={item} />
          </div>
        ))}
        {!sortedFiltered.length && <p className="text-sm text-[color:var(--white)]/60">No results.</p>}
      </div>
    </div>
  );
}
