import { useCallback, useMemo, useState } from 'react';
import { useDataFilter, useHashAction, useInfiniteList, useQueryParamSync } from '@/lib/hooks';

import type { FC } from 'react';
import Filter from '@/components/ui/filter/Filter';
import type { Project } from '@/types';
import ProjectCard from '@/components/ui/cards/ProjectCard';
import Reveal from '@/components/ui/interaction/Reveal';
import { slugify } from '@/lib/slug';

interface ProjectsExplorerProps {
  readonly items: readonly Project[];
}

type ProjectSort = 'newest' | 'oldest' | 'title-az' | 'title-za';

const comparators: Record<ProjectSort, (a: Project, b: Project) => number> = {
  newest: (a, b) => b.year - a.year || a.title.localeCompare(b.title),
  oldest: (a, b) => a.year - b.year || a.title.localeCompare(b.title),
  'title-az': (a, b) => a.title.localeCompare(b.title),
  'title-za': (a, b) => b.title.localeCompare(a.title),
};

const ProjectsExplorerComponent: FC<ProjectsExplorerProps> = ({ items }) => {
  const { q, setQ, filters, setFilters, filtered, filterOptions } = useDataFilter(items, {
    searchFields: (item) => [item.title, item.summary, item.collaborators ?? '', item.role ?? ''],
    filterFields: {
      year: (item) => item.year.toString(),
      tag: (item) => item.tags,
      type: (item) => item.type ?? 'other',
    },
  });

  useQueryParamSync('q', q, setQ);

  const [sort, setSort] = useState<ProjectSort>('newest');

  const sortedFiltered = useMemo(() => {
    const list = [...filtered];
    list.sort(comparators[sort]);
    return list;
  }, [filtered, sort]);

  const { paged, loadingMore, pendingSkeletons, sentinelRef } = useInfiniteList({ items: sortedFiltered, per: 12 });

  // Focus targeted project from hash for better UX
  const focusProject = useCallback((hash: string) => {
    const el = document.querySelector(hash);
    if (el) el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, []);
  useHashAction('project-', focusProject);

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
        {loadingMore &&
          Array.from({ length: pendingSkeletons }).map((_, i) => (
            <div key={`project-skeleton-${i}`} className="p-4 md:p-5 glass-card rounded-2xl border border-border animate-pulse h-40" />
          ))}
        {!sortedFiltered.length && (
          <p className="text-sm text-[color:var(--white)]/60">No results.</p>
        )}
      </div>
      <div ref={sentinelRef} className="h-6 w-full" aria-hidden="true" />
    </div>
  );
};

export default ProjectsExplorerComponent;
