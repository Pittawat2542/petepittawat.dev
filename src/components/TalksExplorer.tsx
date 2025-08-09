import React, { useMemo } from 'react';

import type { Talk } from '../types';
import TalkCard from './ui/TalkCard';
import { useDataFilter } from '../lib/hooks';

type Props = { items: Talk[] };

export default function TalksExplorer({ items }: Props) {
  const { q, setQ, filters, setFilters, filtered } = useDataFilter(items, {
    searchFields: (item) => [item.title, item.audience, item.mode],
    filterFields: {
      mode: (item) => item.mode,
      year: (item) => new Date(item.date).getFullYear().toString(),
      tag: (item) => item.tags
    }
  });

  // Extract unique values for filter options
  const years = useMemo(
    () => Array.from(new Set(items.map((i) => new Date(i.date).getFullYear()))).sort((a, b) => b - a),
    [items]
  );
  
  const modes = useMemo(() => 
    Array.from(new Set(items.map((i) => i.mode))), 
    [items]
  );
  
  const tags = useMemo(() => 
    Array.from(new Set(items.flatMap((i) => i.tags))).sort(), 
    [items]
  );

  // Sort filtered items by date
  const sortedFiltered = useMemo(() => 
    [...filtered].sort((a, b) => +new Date(b.date) - +new Date(a.date)),
    [filtered]
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col md:flex-row gap-3 md:items-center">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search title, audience..."
          className="w-full md:max-w-md rounded-md border border-[color:var(--white)]/15 bg-transparent px-3 py-2 text-sm"
        />
        <div className="flex gap-2">
          <select 
            title="Filter by mode"
            value={filters.mode || 'all'} 
            onChange={(e) => setFilters(f => ({ ...f, mode: e.target.value }))}
            className="rounded-md border border-[color:var(--white)]/15 bg-transparent px-2 py-2 text-sm"
          >
            <option value="all">All modes</option>
            {modes.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          <select 
            title="Filter by year"
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
            title="Filter by tag"
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
        {sortedFiltered.map((item) => (
          <TalkCard key={`${item.title}-${item.date}`} item={item} />
        ))}
        {!sortedFiltered.length && <p className="text-sm text-[color:var(--white)]/60">No results.</p>}
      </div>
    </div>
  );
}
