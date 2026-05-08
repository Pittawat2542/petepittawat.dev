/**
 * DataExplorer - Generic data exploration component
 * Eliminates code duplication following DRY principle
 * Can be used for projects, publications, talks, or any filterable/sortable data
 */

import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { useDataFilter, useHashAction, useQueryParamSync } from '@/lib/hooks';

import FilterPanel from '@/components/ui/filter/FilterPanel';

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
  emptyMessage = 'No results.',
}: DataExplorerConfig<TItem, TSort>) {
  const { q, setQ, filters, setFilters, filtered, filterOptions, totalCount } = useDataFilter(
    items,
    {
      searchFields,
      filterFields: filterFields ?? {},
    }
  );

  useQueryParamSync('q', q, setQ);

  const [sort, setSort] = useState<TSort>(defaultSort);

  const sorted = useMemo(() => {
    const list = Array.from(filtered);
    list.sort(sortComparators[sort]);
    return list;
  }, [filtered, sort, sortComparators]);

  // Focus targeted item from hash for better UX
  const focusItem = useCallback((hash: string) => {
    const el = document.querySelector(hash);
    if (el) el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, []);
  useHashAction(hashPrefix, focusItem);

  return (
    <div className="flex flex-col gap-4">
      <FilterPanel
        searchValue={q}
        onSearchChange={setQ}
        filters={filters}
        onFiltersChange={setFilters}
        filterOptions={filterOptions}
        searchPlaceholder={searchPlaceholder}
        filteredResults={sorted.length}
        totalResults={totalCount}
        sortOptions={sortOptions}
        sortValue={sort}
        onSortChange={value => {
          setSort(value as TSort);
        }}
        compact={true}
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {sorted.map(item => (
          <div
            id={getItemId(item)}
            key={getItemKey(item)}
            className="target-highlight [contain-intrinsic-size:420px] [content-visibility:auto]"
          >
            {renderItem(item)}
          </div>
        ))}
        {!filtered.length && <p className="text-sm text-[color:var(--white)]/60">{emptyMessage}</p>}
      </div>
    </div>
  );
}
