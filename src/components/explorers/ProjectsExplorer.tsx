/* eslint-disable */
import { useCallback, useMemo, useState } from 'react';
import { useDataFilter, useHashAction, usePagination, useQueryParamSync } from '@/lib/hooks';

import type { FC } from 'react';
import Filter from '@/components/ui/filter/Filter';
import PageControls from '@/components/ui/navigation/PageControls';
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
  const { q, setQ, filters, setFilters, filtered, filterOptions, totalCount } = useDataFilter(
    items,
    {
      searchFields: item => [item.title, item.summary, item.collaborators ?? '', item.role ?? ''],
      filterFields: {
        year: item => item.year.toString(),
        tag: item => item.tags,
        type: item => item.type ?? 'other',
      },
    }
  );

  useQueryParamSync('q', q, setQ);

  const [sort, setSort] = useState<ProjectSort>('newest');
  const sorted = useMemo(() => {
    const list = Array.from(filtered);
    list.sort(comparators[sort]);
    return list;
  }, [filtered, sort]);

  // Pagination
  const {
    paginated: paged,
    totalPages,
    currentPage,
    // hasNextPage,
    // hasPrevPage,
    goToPage,
    setPerPage: setPaginationPerPage,
  } = usePagination({
    items: sorted,
    perPage: 6,
    initialPage: 1,
  });

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
        filteredCount={sorted.length}
        totalCount={totalCount}
        sortOptions={[
          { value: 'newest', label: 'Newest' },
          { value: 'oldest', label: 'Oldest' },
          { value: 'title-az', label: 'Title A→Z' },
          { value: 'title-za', label: 'Title Z→A' },
        ]}
        sortValue={sort}
        onSortChange={v => setSort(v as typeof sort)}
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {paged.map((item, i) => (
          <Reveal
            id={`project-${slugify(item.title)}-${item.year}`}
            key={`${item.title}-${item.year}`}
            delayMs={Math.min(i * 50, 400)}
            className="target-highlight"
          >
            <ProjectCard item={item} />
          </Reveal>
        ))}
        {!filtered.length && <p className="text-sm text-[color:var(--white)]/60">No results.</p>}
      </div>
      {totalPages > 1 && (
        <PageControls
          total={sorted.length}
          visible={paged.length}
          perPage={6}
          onPerPageChange={setPaginationPerPage}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={goToPage}
        />
      )}
    </div>
  );
};

export default ProjectsExplorerComponent;
