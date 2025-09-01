import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import Filter from './Filter';
import type { Project } from '../types';
import ProjectCard from './ui/ProjectCard';
import Reveal from './ui/Reveal';
import { useDataFilter } from '../lib/hooks';

type Props = { items: Project[] };

export default function ProjectsExplorer({ items }: Props) {
  const { q, setQ, filters, setFilters, filtered, filterOptions } = useDataFilter(items, {
    searchFields: (item) => [item.title, item.summary, item.collaborators ?? '', item.role ?? ''],
    filterFields: {
      year: (item) => item.year.toString(),
      tag: (item) => item.tags,
      type: (item) => item.type ?? 'other',
    },
  });

  const [sort, setSort] = useState<'newest' | 'oldest' | 'title-az' | 'title-za'>('newest');
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

  // Focus targeted project from hash for better UX
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash || !hash.startsWith('#project-')) return;
    const t = setTimeout(() => {
      const el = document.querySelector(hash) as HTMLElement | null;
      if (el) el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }, 100);
    return () => clearTimeout(t);
  }, []);

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

  // Reset page when inputs change; cancel in-flight loads
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

  // Lazy load more
  useEffect(() => {
    const el = document.getElementById('projects-sentinel');
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) loadNext();
      }
    }, { rootMargin: '800px 0px' });
    io.observe(el);
    return () => {
      io.disconnect();
      if (loadTimerRef.current) {
        clearTimeout(loadTimerRef.current);
        loadTimerRef.current = null;
      }
    };
  }, [loadNext]);

  return (
    <div className="flex flex-col gap-4">
      <Filter
        q={q}
        setQ={setQ}
        filters={filters}
        setFilters={setFilters}
        filterOptions={filterOptions}
        placeholder="Search title, summary, collaborators..."
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paged.map((item, i) => (
          <Reveal id={`project-${slugify(item.title)}-${item.year}`} key={`${item.title}-${item.year}`} delayMs={Math.min(i * 100, 800)} className="target-highlight">
            <ProjectCard item={item} />
          </Reveal>
        ))}
        {loadingMore && (
          Array.from({ length: Math.min(12, Math.max(0, sortedFiltered.length - visibleCount)) }).map((_, i) => (
            <div key={`project-skeleton-${i}`} className="p-4 md:p-5 glass-card rounded-2xl border border-border animate-pulse h-40" />
          ))
        )}
        {!sortedFiltered.length && (
          <p className="text-sm text-[color:var(--white)]/60">No results.</p>
        )}
      </div>
      <div id="projects-sentinel" className="h-6 w-full" aria-hidden="true" />
    </div>
  );
}
