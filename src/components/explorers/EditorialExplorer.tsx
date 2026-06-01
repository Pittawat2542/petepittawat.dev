import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { useDataFilter, useHashAction, useQueryParamSync } from '@/lib/hooks';
import EditorialListingShell from './EditorialListingShell';

type FilterValue = string | number | boolean;
type FilterFieldGetter<TItem> = (item: TItem) => FilterValue | readonly FilterValue[];

export interface EditorialExplorerConfig<TItem, TSort extends string> {
  readonly items: readonly TItem[];
  readonly searchFields: (item: TItem) => string[];
  readonly filterFields?: Record<string, FilterFieldGetter<TItem>>;
  readonly tagField?: FilterFieldGetter<TItem>;
  readonly sortComparators: Record<TSort, (a: TItem, b: TItem) => number>;
  readonly sortOptions: Array<{ value: TSort; label: string }>;
  readonly defaultSort: TSort;
  readonly renderItem: (item: TItem) => ReactNode;
  readonly renderFeaturedItem?: (item: TItem) => ReactNode;
  readonly getItemKey: (item: TItem) => string;
  readonly getItemId: (item: TItem) => string;
  readonly searchPlaceholder: string;
  readonly hashPrefix: string;
  readonly emptyMessage?: string;
  readonly featuredLabel?: string;
  readonly gridLabel?: string;
  readonly emptyTitle?: string;
  readonly emptyCopy?: string;
  readonly toolbarAccessory?: ReactNode;
  readonly footer?: ReactNode;
  readonly resultsClassName?: string;
}

function normalizeFilterValues(value: FilterValue | readonly FilterValue[]) {
  return (Array.isArray(value) ? value : [value])
    .filter(item => item != null && item !== '')
    .map(String);
}

export function EditorialExplorer<TItem, TSort extends string>({
  items,
  searchFields,
  filterFields,
  tagField,
  sortComparators,
  sortOptions,
  defaultSort,
  renderItem,
  renderFeaturedItem,
  getItemKey,
  getItemId,
  searchPlaceholder,
  hashPrefix,
  emptyMessage = 'No results.',
  featuredLabel = 'Featured item',
  gridLabel = 'Results',
  emptyTitle = emptyMessage,
  emptyCopy = 'Try a broader search or clear a filter to restore the full listing.',
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
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());

  const tagOptions = useMemo(() => {
    if (!tagField) return [];
    const values = items.flatMap(item => normalizeFilterValues(tagField(item))).sort();
    return ['All', ...Array.from(new Set(values))];
  }, [items, tagField]);

  const tagCounts = useMemo(() => {
    if (!tagField) return {};
    const counts: Record<string, number> = { All: items.length };
    for (const item of items) {
      for (const tag of normalizeFilterValues(tagField(item))) {
        counts[tag] = (counts[tag] ?? 0) + 1;
      }
    }
    return counts;
  }, [items, tagField]);

  const filteredByTags = useMemo(() => {
    if (!tagField || selectedTags.size === 0) return filtered;
    return filtered.filter(item =>
      normalizeFilterValues(tagField(item)).some(tag => selectedTags.has(tag))
    );
  }, [filtered, selectedTags, tagField]);

  const sorted = useMemo(() => {
    const list = Array.from(filteredByTags);
    list.sort(sortComparators[sort]);
    return list;
  }, [filteredByTags, sort, sortComparators]);

  const featuredItem = sorted[0];
  const gridItems = renderFeaturedItem ? sorted.slice(1) : sorted;

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
      availableTags={tagOptions}
      selectedTags={tagField ? selectedTags : undefined}
      onTagsChange={tagField ? setSelectedTags : undefined}
      tagCounts={tagCounts}
      filteredResults={sorted.length}
      totalResults={totalCount}
      toolbarAccessory={toolbarAccessory}
      footer={footer}
      emptyState={
        <div className="editorial-listing__empty" role="status">
          <h2 className="editorial-listing__empty-title">{emptyTitle}</h2>
          <p className="editorial-listing__empty-copy">{emptyCopy}</p>
        </div>
      }
      itemsWrapperClassName={
        resultsClassName ?? (renderFeaturedItem ? 'editorial-listing__items' : undefined)
      }
    >
      {featuredItem && renderFeaturedItem ? (
        <ul className="editorial-listing__featured" aria-label={featuredLabel}>
          <li
            id={getItemId(featuredItem)}
            key={getItemKey(featuredItem)}
            className="editorial-listing__item target-highlight h-full"
          >
            {renderFeaturedItem(featuredItem)}
          </li>
        </ul>
      ) : null}

      {gridItems.length > 0 ? (
        <ul
          className={renderFeaturedItem ? 'editorial-listing__grid' : undefined}
          aria-label={gridLabel}
        >
          {gridItems.map(item => (
            <li
              id={getItemId(item)}
              key={getItemKey(item)}
              className="editorial-listing__item target-highlight h-full"
            >
              {renderItem(item)}
            </li>
          ))}
        </ul>
      ) : null}
    </EditorialListingShell>
  );
}

export default EditorialExplorer;
