/**
 * DataExplorer - Generic data exploration component
 * Eliminates code duplication following DRY principle
 * Can be used for projects, publications, talks, or any filterable/sortable data
 */

import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { useDataFilter, useHashAction, usePagination, useQueryParamSync } from '@/lib/hooks';

import Filter from '@/components/ui/filter/Filter';
import PageControls from '@/components/ui/navigation/PageControls';
import Reveal from '@/components/ui/interaction/Reveal';

export interface DataExplorerConfig<TItem, TSort extends string> {
  // Data
  items: readonly TItem[];

  // Filtering configuration
  searchFields: (item: TItem) => string[];
  filterFields?: Record<string, (item: TItem) => string | string[] | readonly string[]>;

  // Sorting configuration
  sortComparators: Record<TSort, (a: TItem, b: TItem) => number>;
  sortOptions: Array<{ value: TSort; label: string }>;
  defaultSort: TSort;

  // Display configuration
  renderItem: (item: TItem) => ReactNode;
  getItemKey: (item: TItem) => string;
  getItemId: (item: TItem) => string;
  searchPlaceholder: string;
  hashPrefix: string;

  // Pagination
  perPage: number;

  // Optional
  emptyMessage?: string;
}

export function DataExplorer<TItem, TSort extends string>({
  items,
  searchFields,
  filterFields,
  sortComparators,
  sortOptions,
  defaultSort,
  renderItem,
  getItemKey,
  getItemId,
  searchPlaceholder,
  hashPrefix,
  perPage: initialPerPage,
  emptyMessage = 'No results.',
}: DataExplorerConfig<TItem, TSort>) {
  const { q, setQ, filters, setFilters, filtered, filterOptions, totalCount } = useDataFilter(
    items,
    {
      searchFields,
      filterFields: filterFields || {},
    }
  );

  useQueryParamSync('q', q, setQ);

  const [sort, setSort] = useState<TSort>(defaultSort);
  const [perPage, setPerPageState] = useState(initialPerPage);

  const sorted = useMemo(() => {
    const list = Array.from(filtered);
    list.sort(sortComparators[sort]);
    return list;
  }, [filtered, sort, sortComparators]);

  // Pagination
  const {
    paginated: paged,
    totalPages,
    currentPage,
    goToPage,
    setPerPage: setPaginationPerPage,
  } = usePagination({
    items: sorted,
    perPage,
    initialPage: 1,
  });

  // Focus targeted item from hash for better UX
  const focusItem = useCallback((hash: string) => {
    const el = document.querySelector(hash);
    if (el) el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, []);
  useHashAction(hashPrefix, focusItem);

  const handlePerPageChange = (newPerPage: number) => {
    setPerPageState(newPerPage);
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
        placeholder={searchPlaceholder}
        filteredCount={sorted.length}
        totalCount={totalCount}
        sortOptions={sortOptions}
        sortValue={sort}
        onSortChange={v => setSort(v as TSort)}
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {paged.map((item, i) => (
          <Reveal
            id={getItemId(item)}
            key={getItemKey(item)}
            delayMs={Math.min(i * 50, 400)}
            className="target-highlight"
          >
            {renderItem(item)}
          </Reveal>
        ))}
        {!filtered.length && <p className="text-sm text-[color:var(--white)]/60">{emptyMessage}</p>}
      </div>
      {totalPages > 1 && (
        <PageControls
          total={sorted.length}
          visible={paged.length}
          perPage={perPage}
          onPerPageChange={handlePerPageChange}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={goToPage}
        />
      )}
    </div>
  );
}
