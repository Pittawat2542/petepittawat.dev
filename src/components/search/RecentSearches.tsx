import { Clock } from 'lucide-react';
import type { FC } from 'react';
import { memo } from 'react';

interface RecentSearchesProps {
  readonly recent: readonly string[];
  readonly onSelect: (value: string) => void;
  readonly onClear: () => void;
}

const RecentSearchesComponent: FC<RecentSearchesProps> = ({ recent, onSelect, onClear }) => {
  if (recent.length === 0) return null;

  return (
    <div className="mt-3 flex flex-wrap items-center gap-2">
      <span className="text-muted-foreground inline-flex items-center gap-1 text-xs">
        <Clock size={12} /> Recent:
      </span>
      {recent.map(entry => (
        <button
          key={entry}
          className="rounded-full border border-white/10 px-3 py-1 text-xs transition-colors hover:bg-white/5"
          onClick={() => onSelect(entry)}
          aria-label={`Use recent search ${entry}`}
        >
          {entry}
        </button>
      ))}
      <button
        className="text-muted-foreground hover:text-foreground ml-1 text-[11px] underline decoration-dotted transition-colors"
        onClick={onClear}
        aria-label="Clear recent searches"
      >
        Clear
      </button>
    </div>
  );
};

// Memoize the component with custom comparison
export const RecentSearches = memo(RecentSearchesComponent, (prevProps, nextProps) => {
  return (
    prevProps.recent === nextProps.recent &&
    prevProps.onSelect === nextProps.onSelect &&
    prevProps.onClear === nextProps.onClear
  );
});

RecentSearches.displayName = 'RecentSearches';
export default RecentSearches;
