import type { FC } from 'react';
import { memo } from 'react';
import { SEARCH_TYPE_META, type SearchItemType } from './types';
import { cn } from '@/lib/utils';

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
      <button
        className={cn(
          'rounded-full border px-3 py-1 text-xs',
          allSelected ? 'border-white/20 bg-white/10' : 'border-white/10 hover:bg-white/5'
        )}
        onClick={onSelectAll}
      >
        All
      </button>
      {SEARCH_TYPE_META.map(({ key, label, Icon }) => (
        <button
          key={key}
          className={cn(
            'inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs',
            activeTypes.has(key)
              ? 'border-white/20 bg-white/10'
              : 'border-white/10 hover:bg-white/5'
          )}
          onClick={() => onToggle(key)}
          aria-pressed={activeTypes.has(key)}
        >
          <Icon size={12} /> {label}
          <span className="opacity-70">{counts.get(key) || 0}</span>
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
