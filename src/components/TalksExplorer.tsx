import React, { useMemo, useState } from 'react';
import TalkCard from './ui/TalkCard';
import type { Talk } from './ui/TalkCard';

type Props = { items: Talk[] };

export default function TalksExplorer({ items }: Props) {
  const [q, setQ] = useState('');
  const [mode, setMode] = useState<string>('all');
  const [year, setYear] = useState<string>('all');
  const [tag, setTag] = useState<string>('all');

  const years = useMemo(
    () => Array.from(new Set(items.map((i) => new Date(i.date).getFullYear()))).sort((a, b) => b - a),
    [items]
  );
  const modes = useMemo(() => Array.from(new Set(items.map((i) => i.mode))), [items]);
  const tags = useMemo(() => Array.from(new Set(items.flatMap((i) => i.tags))).sort(), [items]);

  const filtered = useMemo(() => {
    const qLower = q.trim().toLowerCase();
    return items
      .slice()
      .sort((a, b) => +new Date(b.date) - +new Date(a.date))
      .filter((i) => {
        if (mode !== 'all' && i.mode !== mode) return false;
        if (year !== 'all' && String(new Date(i.date).getFullYear()) !== year) return false;
        if (tag !== 'all' && !i.tags?.includes(tag)) return false;
        if (!qLower) return true;
        const hay = [i.title, i.audience, i.mode].join(' ').toLowerCase();
        return hay.includes(qLower);
      });
  }, [items, q, mode, year, tag]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col md:flex-row gap-3 md:items-center">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search title, audience..."
          className="w-full md:max-w-md rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-sm"
        />
        <div className="flex gap-2">
          <select value={mode} onChange={(e) => setMode(e.target.value)} className="rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-2 py-2 text-sm">
            <option value="all">All modes</option>
            {modes.map((m) => (
              <option key={m} value={m}>
                {m}
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
          <TalkCard key={`${item.title}-${item.date}`} item={item} />
        ))}
        {!filtered.length && <p className="text-sm text-gray-500">No results.</p>}
      </div>
    </div>
  );
}
