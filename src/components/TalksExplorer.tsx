import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import Filter from './Filter';
import type { Talk } from '../types';
import TalkCard from './ui/TalkCard';
import Reveal from './ui/Reveal';
import { useDataFilter } from '../lib/hooks';

type Props = { items: Talk[] };

export default function TalksExplorer({ items }: Props) {
  const { q, setQ, filters, setFilters, filtered, filterOptions } = useDataFilter(items, {
    searchFields: (item) => [item.title, item.audience, item.mode],
    filterFields: {
      mode: (item) => item.mode,
      year: (item) => new Date(item.date).getFullYear().toString(),
      tag: (item) => item.tags,
      audience: (item) => item.audience,
    },
  });

  const [sort, setSort] = useState<'newest' | 'oldest' | 'title-az' | 'title-za'>('newest');
  const [per] = useState<number>(12);
  const [page, setPage] = useState<number>(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const loadTimerRef = useRef<number | null>(null);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const qParam = params.get('q');
      if (qParam) setQ(qParam);
      // omit per/page from URL for pure infinite scroll
    } catch {}
  }, [setQ]);

  // Keep q in sync with URL on navigation
  useEffect(() => {
    const syncFromUrl = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const qParam = params.get('q') || '';
        setQ(qParam);
      } catch {}
    };
    window.addEventListener('popstate', syncFromUrl);
    window.addEventListener('hashchange', syncFromUrl);
    return () => {
      window.removeEventListener('popstate', syncFromUrl);
      window.removeEventListener('hashchange', syncFromUrl);
    };
  }, [setQ]);

  // Focus targeted talk from hash for better UX
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash || !hash.startsWith('#talk-')) return;
    const t = setTimeout(() => {
      const el = document.querySelector(hash) as HTMLElement | null;
      if (el) el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }, 100);
    return () => clearTimeout(t);
  }, []);

  // Sort filtered items by date
  const sortedFiltered = useMemo(() => {
    const list = [...filtered];
    list.sort((a, b) => {
      switch (sort) {
        case 'oldest':
          return +new Date(a.date) - +new Date(b.date) || a.title.localeCompare(b.title);
        case 'title-az':
          return a.title.localeCompare(b.title);
        case 'title-za':
          return b.title.localeCompare(a.title);
        case 'newest':
        default:
          return +new Date(b.date) - +new Date(a.date) || a.title.localeCompare(b.title);
      }
    });
    return list;
  }, [filtered, sort]);

  // Reset and derive paged
  useEffect(() => {
    setPage(1);
    if (loadTimerRef.current) {
      clearTimeout(loadTimerRef.current);
      loadTimerRef.current = null;
    }
    setLoadingMore(false);
  }, [q, filters, sort]);
  const visibleCount = Math.min(sortedFiltered.length, per * page);
  const paged = useMemo(() => sortedFiltered.slice(0, visibleCount), [sortedFiltered, visibleCount]);

  // Keep URL updated
  useEffect(() => {
    try {
      const params = new URLSearchParams();
      if (q.trim()) params.set('q', q.trim());
      const url = `${window.location.pathname}${params.size ? `?${params.toString()}` : ''}`;
      window.history.replaceState({}, '', url);
    } catch {}
  }, [q]);

  const loadNext = useCallback(() => {
    if (loadingMore) return;
    if (visibleCount >= sortedFiltered.length) return;
    setLoadingMore(true);
    if (loadTimerRef.current) clearTimeout(loadTimerRef.current);
    loadTimerRef.current = window.setTimeout(() => {
      setPage((p) => p + 1);
      setLoadingMore(false);
      loadTimerRef.current = null;
    }, 250);
  }, [loadingMore, visibleCount, sortedFiltered.length]);

  // Lazy load more
  useEffect(() => {
    const el = document.getElementById('talks-sentinel');
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) loadNext();
    }, { rootMargin: '800px 0px' });
    io.observe(el);
    return () => {
      io.disconnect();
    };
  }, [loadNext]);

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
        sortOptions={[
          { value: 'newest', label: 'Newest' },
          { value: 'oldest', label: 'Oldest' },
          { value: 'title-az', label: 'Title A→Z' },
          { value: 'title-za', label: 'Title Z→A' },
        ]}
        sortValue={sort}
        onSortChange={(v) => setSort(v as typeof sort)}
      />
      <div className="grid gap-3">
        {paged.map((item, i) => (
          <Reveal id={`talk-${slugify(item.title)}-${new Date(item.date).getFullYear()}`} key={`${item.title}-${item.date}`} delayMs={Math.min(i * 100, 800)} className="target-highlight">
            <TalkCard item={item} />
          </Reveal>
        ))}
        {loadingMore && (
          Array.from({ length: Math.min(12, Math.max(0, sortedFiltered.length - visibleCount)) }).map((_, i) => (
            <div key={`talk-skeleton-${i}`} className="p-4 md:p-5 glass-card rounded-2xl border border-border animate-pulse h-28" />
          ))
        )}
        {!sortedFiltered.length && <p className="text-sm text-[color:var(--white)]/60">No results.</p>}
      </div>
      <div id="talks-sentinel" className="h-6 w-full" aria-hidden="true" />
    </div>
  );
}
