import { SEARCH_TYPE_META, type SearchItemType } from './types';
import { cn } from '../../lib/utils';

type SearchFilterChipsProps = {
  activeTypes: Set<SearchItemType>;
  counts: Map<SearchItemType, number>;
  onToggle: (type: SearchItemType) => void;
  onSelectAll: () => void;
};

export function SearchFilterChips({ activeTypes, counts, onToggle, onSelectAll }: SearchFilterChipsProps) {
  const allSelected = activeTypes.size === SEARCH_TYPE_META.length;

  return (
    <div className="mt-3 flex flex-wrap gap-1.5">
      <button
        className={cn(
          'text-xs rounded-full px-3 py-1 border',
          allSelected ? 'bg-white/10 border-white/20' : 'border-white/10 hover:bg-white/5'
        )}
        onClick={onSelectAll}
      >
        All
      </button>
      {SEARCH_TYPE_META.map(({ key, label, Icon }) => (
        <button
          key={key}
          className={cn(
            'text-xs rounded-full px-3 py-1 border inline-flex items-center gap-1',
            activeTypes.has(key) ? 'bg-white/10 border-white/20' : 'border-white/10 hover:bg-white/5'
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
}
