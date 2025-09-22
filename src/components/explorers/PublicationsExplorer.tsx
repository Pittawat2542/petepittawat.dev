/* eslint-disable */
import { memo, useCallback, useMemo, useState } from 'react';
import { useDataFilter, useHashAction, usePagination, useQueryParamSync } from '@/lib/hooks';

import type { FC } from 'react';
import { FIRST_AUTHOR_TITLE } from '@/lib/constants';
import Filter from '@/components/ui/filter/Filter';
import PageControls from '@/components/ui/navigation/PageControls';
import type { Publication } from '@/types';
import PublicationCard from '@/components/ui/publication/PublicationCard';
import Reveal from '@/components/ui/interaction/Reveal';
import { isFirstAuthor } from '@/lib';
import { slugify } from '@/lib/slug';

interface PublicationsExplorerProps {
  readonly items: readonly Publication[];
}

type PublicationSort = 'newest' | 'oldest' | 'title-az' | 'title-za' | 'venue-az' | 'venue-za' | 'type';

const comparators: Record<PublicationSort, (a: Publication, b: Publication) => number> = {
  newest: (a, b) => b.year - a.year || a.title.localeCompare(b.title),
  oldest: (a, b) => a.year - b.year || a.title.localeCompare(b.title),
  'title-az': (a, b) => a.title.localeCompare(b.title),
  'title-za': (a, b) => b.title.localeCompare(a.title),
  'venue-az': (a, b) => (a.venue || '').localeCompare(b.venue || '') || a.title.localeCompare(b.title),
  'venue-za': (a, b) => (b.venue || '').localeCompare(a.venue || '') || a.title.localeCompare(b.title),
  type: (a, b) => (a.type || '').localeCompare(b.type || '') || b.year - a.year,
};

const PublicationsExplorerComponent: FC<PublicationsExplorerProps> = ({ items }) => {
  const { q, setQ, filters, setFilters, filtered, filterOptions, totalCount } = useDataFilter(items, {
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

  useQueryParamSync('q', q, setQ);

  const [sort, setSort] = useState<PublicationSort>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(12);

  const sortedFiltered = useMemo(() => {
    const list = Array.from(filtered);
    list.sort(comparators[sort]);
    return list;
  }, [filtered, sort]);

  const { paginated: paged, totalPages, hasNextPage, hasPrevPage, goToPage, setPerPage: setPaginationPerPage } = usePagination({ 
    items: sortedFiltered, 
    perPage,
    initialPage: currentPage
  });

  // Auto-expand targeted publication from hash (open modal)
  const openPublication = useCallback((hash: string) => {
    const container = document.querySelector(hash);
    if (!container) return;
    const card = container.querySelector('.publication-card');
    if (card) card.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
  }, []);
  useHashAction('pub-', openPublication, 150);

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
        placeholder="Search title, authors, venue..."
        filteredCount={sortedFiltered.length}
        totalCount={totalCount}
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
          <Reveal id={`pub-${slugify(item.title)}-${item.year}`} key={`${item.title}-${item.year}`} delayMs={Math.min(i * 50, 400)} className="target-highlight">
            <PublicationCard item={item} />
          </Reveal>
        ))}
        {!sortedFiltered.length && <p className="text-sm text-[color:var(--white)]/60">No results.</p>}
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

export const PublicationsExplorer = memo(PublicationsExplorerComponent);
PublicationsExplorer.displayName = 'PublicationsExplorer';
export default PublicationsExplorer;