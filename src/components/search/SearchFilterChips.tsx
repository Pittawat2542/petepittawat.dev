import type { FC } from 'react';
import { memo } from 'react';
import { SEARCH_TYPE_META, type SearchItemType } from './types';

interface SearchFilterChipsProps {
  readonly activeTypes: Set<SearchItemType>;
  readonly counts: Map<SearchItemType, number>;
  readonly onToggle: (type: SearchItemType) => void;
  readonly onSelectAll: () => void;
}

const SearchFilterChipsComponent: FC<SearchFilterChipsProps> = ({
  activeTypes,
  counts,
  onToggle,
  onSelectAll,
}) => {
  const allSelected = activeTypes.size === SEARCH_TYPE_META.length;

  return (
    <div className="mt-3 flex flex-wrap gap-1.5">
      <button className="search-type-chip" aria-pressed={allSelected} onClick={onSelectAll}>
        All
      </button>
      {SEARCH_TYPE_META.map(({ key, label, Icon }) => (
        <button
          key={key}
          className="search-type-chip"
          onClick={() => {
            onToggle(key);
          }}
          aria-pressed={activeTypes.has(key)}
        >
          <Icon size={12} /> {label}
          <span className="opacity-70">{counts.get(key) ?? 0}</span>
        </button>
      ))}
    </div>
  );
};

// Memoize the component with custom comparison
export const SearchFilterChips = memo(SearchFilterChipsComponent, (prevProps, nextProps) => {
  return (
    prevProps.activeTypes === nextProps.activeTypes &&
    prevProps.counts === nextProps.counts &&
    prevProps.onToggle === nextProps.onToggle &&
    prevProps.onSelectAll === nextProps.onSelectAll
  );
});

SearchFilterChips.displayName = 'SearchFilterChips';
export default SearchFilterChips;
