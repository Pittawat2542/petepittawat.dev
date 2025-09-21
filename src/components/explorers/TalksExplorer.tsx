import { memo, useCallback, useMemo, useState } from 'react';
import { useDataFilter, useHashAction, useInfiniteList, useQueryParamSync } from '@/lib/hooks';

import type { FC } from 'react';
import Filter from '@/components/ui/filter/Filter';
import Reveal from '@/components/ui/interaction/Reveal';
import type { Talk } from '@/types';
import TalkCard from '@/components/ui/cards/TalkCard';
import { slugify } from '@/lib/slug';

interface TalksExplorerProps {
  readonly items: readonly Talk[];
}

type TalkSort = 'newest' | 'oldest' | 'title-az' | 'title-za';

const comparators: Record<TalkSort, (a: Talk, b: Talk) => number> = {
  newest: (a, b) => +new Date(b.date) - +new Date(a.date) || a.title.localeCompare(b.title),
  oldest: (a, b) => +new Date(a.date) - +new Date(b.date) || a.title.localeCompare(b.title),
  'title-az': (a, b) => a.title.localeCompare(b.title),
  'title-za': (a, b) => b.title.localeCompare(a.title),
};

const TalksExplorerComponent: FC<TalksExplorerProps> = ({ items }) => {
  const { q, setQ, filters, setFilters, filtered, filterOptions, totalCount } = useDataFilter(items, {
    searchFields: (item) => [item.title, item.audience, item.mode],
    filterFields: {
      mode: (item) => item.mode,
      year: (item) => new Date(item.date).getFullYear().toString(),
      tag: (item) => item.tags,
      audience: (item) => item.audience,
    },
  });

  useQueryParamSync('q', q, setQ);

  const [sort, setSort] = useState<TalkSort>('newest');

  // Focus targeted talk from hash for better UX
  const focusTalk = useCallback((hash: string) => {
    const el = document.querySelector(hash);
    if (el) el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, []);
  useHashAction('talk-', focusTalk);

  // Sort filtered items by date
  const sortedFiltered = useMemo(() => {
    const list = Array.from(filtered);
    list.sort(comparators[sort]);
    return list;
  }, [filtered, sort]);

  const { paged, loadingMore, pendingSkeletons, sentinelRef } = useInfiniteList({ items: sortedFiltered, per: 12 });

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
        totalCount={totalCount}
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
        {loadingMore &&
          Array.from({ length: pendingSkeletons }).map((_, i) => (
            <div key={`talk-skeleton-${i}`} className="p-4 md:p-5 glass-card rounded-2xl border border-border animate-pulse h-28" />
          ))}
        {!sortedFiltered.length && <p className="text-sm text-[color:var(--white)]/60">No results.</p>}
      </div>
      <div ref={sentinelRef} className="h-6 w-full" aria-hidden="true" />
    </div>
  );
};

export const TalksExplorer = memo(TalksExplorerComponent);
TalksExplorer.displayName = 'TalksExplorer';
export default TalksExplorer;
