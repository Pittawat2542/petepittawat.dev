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
  const { q, setQ, filters, setFilters, filtered, filterOptions, totalCount } = useDataFilter(items, {
    searchFields: (item) => [item.title, item.summary, item.collaborators ?? '', item.role ?? ''],
    filterFields: {
      year: (item) => item.year.toString(),
      tag: (item) => item.tags,
      type: (item) => item.type ?? 'other',
    },
  });

  useQueryParamSync('q', q, setQ);

  const [sort, setSort] = useState<ProjectSort>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(12);

  const sortedFiltered = useMemo(() => {
    const list = [...filtered];
    list.sort(comparators[sort]);
    return list;
  }, [filtered, sort]);

  const { paginated: paged, totalPages, hasNextPage, hasPrevPage, goToPage, setPerPage: setPaginationPerPage } = usePagination({ 
    items: sortedFiltered, 
    perPage,
    initialPage: currentPage
  });

  // Focus targeted project from hash for better UX
  const focusProject = useCallback((hash: string) => {
    const el = document.querySelector(hash);
    if (el) el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, []);
  useHashAction('project-', focusProject);

  const handlePerPageChange = (newPerPage: number) => {
    setPerPage(newPerPage);
    setPaginationPerPage(newPerPage);
  };

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paged.map((item, i) => (
          <Reveal id={`project-${slugify(item.title)}-${item.year}`} key={`${item.title}-${item.year}`} delayMs={Math.min(i * 50, 400)} className="target-highlight">
            <ProjectCard item={item} />
          </Reveal>
        ))}
        {!sortedFiltered.length && (
          <p className="text-sm text-[color:var(--white)]/60">No results.</p>
        )}
      </div>
      {totalPages > 1 && (
        <PageControls
          total={sortedFiltered.length}
          visible={paged.length}
          perPage={perPage}
          onPerPageChange={handlePerPageChange}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => {
            goToPage(page);
            setCurrentPage(page);
          }}
        />
      )}
    </div>
  );
};

export default ProjectsExplorerComponent;