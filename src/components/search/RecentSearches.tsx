import { Clock } from 'lucide-react';

interface RecentSearchesProps {
  recent: string[];
  onSelect: (value: string) => void;
  onClear: () => void;
}

export function RecentSearches({ recent, onSelect, onClear }: Readonly<RecentSearchesProps>) {
  if (recent.length === 0) return null;

  return (
    <div className="mt-3 flex flex-wrap items-center gap-2">
      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
        <Clock size={12} /> Recent:
      </span>
      {recent.map((entry) => (
        <button
          key={entry}
          className="text-xs rounded-full px-3 py-1 border border-white/10 hover:bg-white/5 transition-colors"
          onClick={() => onSelect(entry)}
          aria-label={`Use recent search ${entry}`}
        >
          {entry}
        </button>
      ))}
      <button
        className="ml-1 text-[11px] text-muted-foreground hover:text-foreground underline decoration-dotted transition-colors"
        onClick={onClear}
        aria-label="Clear recent searches"
      >
        Clear
      </button>
    </div>
  );
}