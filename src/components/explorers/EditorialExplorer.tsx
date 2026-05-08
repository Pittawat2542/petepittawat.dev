import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { useDataFilter, useHashAction, useQueryParamSync } from '@/lib/hooks';
import EditorialListingShell from './EditorialListingShell';

export interface EditorialExplorerConfig<TItem, TSort extends string> {
  readonly items: readonly TItem[];
  readonly searchFields: (item: TItem) => string[];
  readonly filterFields?: Record<string, (item: TItem) => string | string[] | readonly string[]>;
  readonly sortComparators: Record<TSort, (a: TItem, b: TItem) => number>;
  readonly sortOptions: Array<{ value: TSort; label: string }>;
  readonly defaultSort: TSort;
  readonly renderItem: (item: TItem) => ReactNode;
  readonly getItemKey: (item: TItem) => string;
  readonly getItemId: (item: TItem) => string;
  readonly searchPlaceholder: string;
  readonly hashPrefix: string;
  readonly emptyMessage?: string;
  readonly toolbarAccessory?: ReactNode;
  readonly footer?: ReactNode;
  readonly resultsClassName?: string;
}

export function EditorialExplorer<TItem, TSort extends string>({
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
  toolbarAccessory,
  footer,
  resultsClassName,
}: EditorialExplorerConfig<TItem, TSort>) {
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

  const focusItem = useCallback((hash: string) => {
    const el = document.querySelector(hash);
    if (el) el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, []);
  useHashAction(hashPrefix, focusItem);

  return (
    <EditorialListingShell
      searchValue={q}
      onSearchChange={setQ}
      searchPlaceholder={searchPlaceholder}
      filters={filters}
      onFiltersChange={setFilters}
      filterOptions={filterOptions}
      sortOptions={sortOptions}
      sortValue={sort}
      onSortChange={value => {
        setSort(value as TSort);
      }}
      filteredResults={sorted.length}
      totalResults={totalCount}
      toolbarAccessory={toolbarAccessory}
      footer={footer}
      emptyState={<p className="mt-5 text-sm text-white/58">{emptyMessage}</p>}
      itemsWrapperClassName={resultsClassName}
    >
      {sorted.map(item => (
        <div
          id={getItemId(item)}
          key={getItemKey(item)}
          className="target-highlight h-full [contain-intrinsic-size:420px] [content-visibility:auto]"
        >
          {renderItem(item)}
        </div>
      ))}
    </EditorialListingShell>
  );
}

export default EditorialExplorer;
