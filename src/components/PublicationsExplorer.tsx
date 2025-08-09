import React, { useMemo } from 'react';
import PublicationCard from './ui/PublicationCard';
import { useDataFilter } from '../lib/hooks';
import type { Publication } from '../types';

type Props = { items: Publication[] };

export default function PublicationsExplorer({ items }: Props) {
  const { q, setQ, filters, setFilters, filtered, filterOptions } = useDataFilter(items, {
    searchFields: (item) => [item.title, item.authors, item.venue, item.type],
    filterFields: {
      type: (item) => item.type,
      year: (item) => item.year.toString(),
      tag: (item) => item.tags
    }
  });

  // Extract unique values for filter options
  const years = useMemo(() => 
    Array.from(new Set(items.map((i) => i.year))).sort((a, b) => b - a), 
    [items]
  );
  
  const types = useMemo(() => 
    Array.from(new Set(items.map((i) => i.type))), 
    [items]
  );
  
  const tags = useMemo(() => 
    Array.from(new Set(items.flatMap((i) => i.tags))).sort(), 
    [items]
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col md:flex-row gap-3 md:items-center">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search title, authors, venue..."
          className="w-full md:max-w-md rounded-md border border-[color:var(--white)]/15 bg-transparent px-3 py-2 text-sm"
        />
        <div className="flex gap-2">
          <select 
            value={filters.type || 'all'} 
            onChange={(e) => setFilters(f => ({ ...f, type: e.target.value }))}
            className="rounded-md border border-[color:var(--white)]/15 bg-transparent px-2 py-2 text-sm"
          >
            <option value="all">All types</option>
            {types.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <select 
            value={filters.year || 'all'} 
            onChange={(e) => setFilters(f => ({ ...f, year: e.target.value }))}
            className="rounded-md border border-[color:var(--white)]/15 bg-transparent px-2 py-2 text-sm"
          >
            <option value="all">All years</option>
            {years.map((y) => (
              <option key={y} value={String(y)}>
                {y}
              </option>
            ))}
          </select>
          <select 
            value={filters.tag || 'all'} 
            onChange={(e) => setFilters(f => ({ ...f, tag: e.target.value }))}
            className="rounded-md border border-[color:var(--white)]/15 bg-transparent px-2 py-2 text-sm"
          >
            <option value="all">All tags</option>
            {tags.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid gap-3">
        {filtered.map((item) => (
          <PublicationCard key={`${item.title}-${item.year}`} item={item} />
        ))}
        {!filtered.length && <p className="text-sm text-[color:var(--white)]/60">No results.</p>}
      </div>
    </div>
  );
}
