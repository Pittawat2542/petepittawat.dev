import { useEffect, useMemo, useState } from 'react';

import { FIRST_AUTHOR_TITLE } from '../lib/constants';
import Filter from './Filter';
import type { Publication } from '../types';
import PublicationCard from './ui/PublicationCard';
import { isFirstAuthor } from '../lib';
import { useDataFilter } from '../lib/hooks';

type Props = { items: Publication[] };

export default function PublicationsExplorer({ items }: Props) {
  const { q, setQ, filters, setFilters, filtered, filterOptions } = useDataFilter(items, {
    searchFields: (item) => [item.title, item.authors, item.venue, item.type],
    filterFields: {
      type: (item) => item.type,
      year: (item) => item.year.toString(),
      tag: (item) => item.tags,
      venue: (item) => item.venue,
      authorship: (item) => {
        const first = isFirstAuthor(item.authors);
        const coFirst = item.title.trim() === FIRST_AUTHOR_TITLE;
        return first ? 'first-author' : coFirst ? 'co-first-author' : 'author';
      },
    },
  });

  const [sort, setSort] = useState<'newest' | 'oldest' | 'title-az' | 'title-za' | 'venue-az' | 'venue-za' | 'type'>('newest');

  const sortedFiltered = useMemo(() => {
    const list = [...filtered];
    list.sort((a, b) => {
      switch (sort) {
        case 'oldest':
          return a.year - b.year || a.title.localeCompare(b.title);
        case 'title-az':
          return a.title.localeCompare(b.title);
        case 'title-za':
          return b.title.localeCompare(a.title);
        case 'venue-az':
          return (a.venue || '').localeCompare(b.venue || '') || a.title.localeCompare(b.title);
        case 'venue-za':
          return (b.venue || '').localeCompare(a.venue || '') || a.title.localeCompare(b.title);
        case 'type':
          return (a.type || '').localeCompare(b.type || '') || b.year - a.year;
        case 'newest':
        default:
          return b.year - a.year || a.title.localeCompare(b.title);
      }
    });
    return list;
  }, [filtered, sort]);

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
        filteredCount={sortedFiltered.length}
        sortOptions={[
          { value: 'newest', label: 'Newest' },
          { value: 'oldest', label: 'Oldest' },
          { value: 'title-az', label: 'Title A→Z' },
          { value: 'title-za', label: 'Title Z→A' },
          { value: 'venue-az', label: 'Venue A→Z' },
          { value: 'venue-za', label: 'Venue Z→A' },
          { value: 'type', label: 'Type' },
        ]}
        sortValue={sort}
        onSortChange={(v) => setSort(v as typeof sort)}
      />
      <div className="grid grid-cols-1 gap-3">
        {sortedFiltered.map((item, i) => (
          <div id={`pub-${slugify(item.title)}-${item.year}`} key={`${item.title}-${item.year}`} className="stagger-fade-in target-highlight" style={{ animationDelay: `${Math.min(i * 100, 800)}ms` }}>
            <PublicationCard item={item} />
          </div>
        ))}
        {!sortedFiltered.length && <p className="text-sm text-[color:var(--white)]/60">No results.</p>}
      </div>
    </div>
  );
}
