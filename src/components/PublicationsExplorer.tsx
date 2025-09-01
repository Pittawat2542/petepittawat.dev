import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { FIRST_AUTHOR_TITLE } from '../lib/constants';
import Filter from './Filter';
import type { Publication } from '../types';
import PublicationCard from './ui/PublicationCard';
import Reveal from './ui/Reveal';
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
  const [per] = useState<number>(12);
  const [page, setPage] = useState<number>(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const loadTimerRef = useRef<number | null>(null);

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

  // Reset page on search/filter/sort change
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

  useEffect(() => {
    const el = document.getElementById('publications-sentinel');
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) loadNext();
      }
    }, { rootMargin: '800px 0px' });
    io.observe(el);
    return () => {
      io.disconnect();
    };
  }, [loadNext]);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const qParam = params.get('q');
      if (qParam) setQ(qParam);
    } catch {}
  }, [setQ]);

  // Keep q in sync with URL on back/forward navigation
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

  // Auto-expand targeted publication from hash (open modal)
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash || !hash.startsWith('#pub-')) return;
    // Delay to allow initial render
    const t = setTimeout(() => {
      const container = document.querySelector(hash) as HTMLElement | null;
      if (!container) return;
      const card = container.querySelector('.publication-card') as HTMLElement | null;
      if (card) card.click();
    }, 150);
    return () => clearTimeout(t);
  }, []);

  // Pure infinite scroll: do not read per/page from URL

  // Keep URL in sync (omit per/page)
  useEffect(() => {
    try {
      const params = new URLSearchParams();
      if (q.trim()) params.set('q', q.trim());
      const query = params.toString();
      const url = query ? `?${query}` : window.location.pathname;
      window.history.replaceState({}, '', url);
    } catch {}
  }, [q]);

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
        {paged.map((item, i) => (
          <Reveal id={`pub-${slugify(item.title)}-${item.year}`} key={`${item.title}-${item.year}`} delayMs={Math.min(i * 100, 800)} className="target-highlight">
            <PublicationCard item={item} />
          </Reveal>
        ))}
        {loadingMore && (
          Array.from({ length: Math.min(12, Math.max(0, sortedFiltered.length - visibleCount)) }).map((_, i) => (
            <div key={`pub-skeleton-${i}`} className="p-4 md:p-5 glass-card rounded-2xl border border-border animate-pulse h-32" />
          ))
        )}
        {!sortedFiltered.length && <p className="text-sm text-[color:var(--white)]/60">No results.</p>}
      </div>
      <div id="publications-sentinel" className="h-6 w-full" aria-hidden="true" />
    </div>
  );
}
