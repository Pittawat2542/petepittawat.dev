export interface FilterPanelTotals {
  readonly hasDropdownFilters: boolean;
  readonly hasTags: boolean;
  readonly hasActiveFilters: boolean;
  readonly activeDropdownEntries: ReadonlyArray<readonly [string, string]>;
  readonly activeTags: readonly string[];
  readonly activeCount: number;
}

export const EMPTY_FILTERS: Record<string, string> = Object.freeze({});
export const EMPTY_FILTER_OPTIONS: Record<string, readonly string[]> = Object.freeze({});
export const EMPTY_TAGS: readonly string[] = Object.freeze([]);
export const EMPTY_TAG_COUNTS: Record<string, number> = Object.freeze({});
export const EMPTY_SORT_OPTIONS: ReadonlyArray<{ readonly value: string; readonly label: string }> =
  Object.freeze([]);

export function deriveFilterTotals(
  filters: Record<string, string>,
  filterOptions: Record<string, readonly string[]>,
  availableTags: readonly string[],
  selectedTags: Set<string> | null
): FilterPanelTotals {
  const activeDropdownEntries = Object.entries(filters).filter(
    ([, value]) => value !== 'all' && value !== ''
  ) as FilterPanelTotals['activeDropdownEntries'];

  const activeTags = selectedTags ? Array.from(selectedTags) : EMPTY_TAGS;
  const hasDropdownFilters = Object.keys(filterOptions).length > 0;
  const hasTags = availableTags.length > 0;
  const hasActiveFilters = activeDropdownEntries.length > 0 || Boolean(selectedTags?.size);

  return {
    hasDropdownFilters,
    hasTags,
    hasActiveFilters,
    activeDropdownEntries,
    activeTags,
    activeCount: activeDropdownEntries.length + activeTags.length,
  };
}
