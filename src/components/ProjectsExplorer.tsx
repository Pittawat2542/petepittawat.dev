import { useEffect, useMemo, useState } from 'react';

import Filter from './Filter';
import type { Project } from '../types';
import ProjectCard from './ui/ProjectCard';
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
        {sortedFiltered.map((item, i) => (
          <div id={`project-${slugify(item.title)}-${item.year}`} key={`${item.title}-${item.year}`} className="stagger-fade-in target-highlight" style={{ animationDelay: `${Math.min(i * 100, 800)}ms` }}>
            <ProjectCard item={item} />
          </div>
        ))}
        {!sortedFiltered.length && (
          <p className="text-sm text-[color:var(--white)]/60">No results.</p>
        )}
      </div>
    </div>
  );
}
