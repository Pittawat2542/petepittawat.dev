import type { FC } from 'react';
import { memo } from 'react';

interface Suggestion {
  readonly id: string;
  readonly title: string;
  readonly url: string;
}

interface SearchEmptyStateProps {
  readonly suggestions: readonly Suggestion[];
}

const SearchEmptyStateComponent: FC<SearchEmptyStateProps> = ({ suggestions }) => {
  return (
    <div className="text-muted-foreground px-3 py-4 text-sm">
      <p className="mb-2">No results. Try a different query or explore:</p>
      <div className="flex flex-wrap gap-2">
        {suggestions.map(suggestion => (
          <a
            key={suggestion.id}
            href={suggestion.url}
            className="shape-squircle-sm rounded-[1.1rem] border border-white/10 px-3 py-1 transition-colors hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:outline-none"
          >
            {suggestion.title}
          </a>
        ))}
      </div>
    </div>
  );
};

// Memoize the component
export const SearchEmptyState = memo(SearchEmptyStateComponent);
SearchEmptyState.displayName = 'SearchEmptyState';
export default SearchEmptyState;
