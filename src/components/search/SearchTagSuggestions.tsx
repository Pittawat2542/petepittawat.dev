import '@/styles/components/search-suggestions.css';

import type { FC } from 'react';
import { memo } from 'react';
import { Tag } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TagSuggestion {
  readonly name: string;
  readonly count: number;
}

interface SearchTagSuggestionsProps {
  readonly tags: readonly TagSuggestion[];
  readonly onTagSelect: (query: string) => void;
  readonly query: string;
}

export const SearchTagSuggestionsComponent: FC<SearchTagSuggestionsProps> = ({
  tags,
  onTagSelect,
  query,
}) => {
  if (!tags.length) {
    return (
      <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/40">
          <Tag size={20} aria-hidden="true" />
        </div>
        <h3 className="mb-1 text-sm font-semibold text-white/95">
          No tags match &ldquo;{query.slice(1)}&rdquo;
        </h3>
        <p className="max-w-[280px] text-xs leading-relaxed text-white/40">
          Try typing a different technology name or delete the hashtag to search normally.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col border-b border-white/5 bg-white/[0.01] px-6 py-8">
      <div className="mb-4 flex items-center gap-2 text-white/60">
        <Tag size={14} className="animate-pulse-subtle" />
        <h3 className="type-micro font-bold tracking-wider uppercase">
          {query === '#' ? 'Filter by Tag' : 'Matching Tags'}
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-2">
        {tags.map(tag => {
          const cleanQuery = query.startsWith('#') ? query.slice(1).trim() : query.trim();
          const isMatched = cleanQuery && tag.name.toLowerCase().includes(cleanQuery.toLowerCase());
          return (
            <button
              key={tag.name}
              type="button"
              onClick={() => {
                onTagSelect('#' + tag.name);
              }}
              className={cn(
                'search-badge flex items-center justify-between gap-2 text-left transition-all sm:justify-start',
                isMatched
                  ? 'border-accent/40 bg-accent/10 text-accent font-semibold'
                  : 'border-white/10 bg-white/5 text-white/70'
              )}
            >
              <span className="truncate">#{tag.name}</span>
              <span
                className={cn(
                  'type-micro rounded px-1.5 py-0.5 font-mono font-semibold tracking-normal',
                  isMatched ? 'bg-accent/20 text-accent' : 'bg-white/10 text-white/40'
                )}
              >
                {tag.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export const SearchTagSuggestions = memo(SearchTagSuggestionsComponent);
SearchTagSuggestions.displayName = 'SearchTagSuggestions';
export default SearchTagSuggestions;
