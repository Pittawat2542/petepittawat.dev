import React, { useMemo, useState } from 'react';
import PublicationCard from './ui/PublicationCard';
import type { Publication } from './ui/PublicationCard';

type Props = { items: Publication[] };

export default function PublicationsExplorer({ items }: Props) {
  const [q, setQ] = useState('');
  const [type, setType] = useState<string>('all');
  const [year, setYear] = useState<string>('all');
  const [tag, setTag] = useState<string>('all');

  const years = useMemo(() => Array.from(new Set(items.map((i) => i.year))).sort((a, b) => b - a), [items]);
  const types = useMemo(() => Array.from(new Set(items.map((i) => i.type))), [items]);
  const tags = useMemo(() => Array.from(new Set(items.flatMap((i) => i.tags))).sort(), [items]);

  const filtered = useMemo(() => {
    const qLower = q.trim().toLowerCase();
    return items.filter((i) => {
      if (type !== 'all' && i.type !== type) return false;
      if (year !== 'all' && String(i.year) !== year) return false;
      if (tag !== 'all' && !i.tags?.includes(tag)) return false;
      if (!qLower) return true;
      const hay = [i.title, i.authors, i.venue, i.type].join(' ').toLowerCase();
      return hay.includes(qLower);
    });
  }, [items, q, type, year, tag]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col md:flex-row gap-3 md:items-center">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search title, authors, venue..."
          className="w-full md:max-w-md rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-sm"
        />
        <div className="flex gap-2">
          <select value={type} onChange={(e) => setType(e.target.value)} className="rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-2 py-2 text-sm">
            <option value="all">All types</option>
            {types.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <select value={year} onChange={(e) => setYear(e.target.value)} className="rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-2 py-2 text-sm">
            <option value="all">All years</option>
            {years.map((y) => (
              <option key={y} value={String(y)}>
                {y}
              </option>
            ))}
          </select>
          <select value={tag} onChange={(e) => setTag(e.target.value)} className="rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-2 py-2 text-sm">
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
        {!filtered.length && <p className="text-sm text-gray-500">No results.</p>}
      </div>
    </div>
  );
}
