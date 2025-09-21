import type { FC } from 'react';
import { memo } from 'react';

interface Suggestion {
  readonly id: string;
  readonly title: string;
  readonly url: string;
}

interface SearchSuggestionsProps {
  readonly suggestions: readonly Suggestion[];
}

const SearchSuggestionsComponent: FC<SearchSuggestionsProps> = ({ suggestions }) => {
  if (!suggestions.length) return null;

  return (
    <div className="px-3 py-8 text-sm text-muted-foreground">
      <p className="mb-3">Start typing to search across the site, or explore:</p>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion) => (
          <a
            key={suggestion.id}
            href={suggestion.url}
            className="rounded-full px-3 py-1 border border-white/10 hover:bg-white/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
          >
            {suggestion.title}
          </a>
        ))}
      </div>
    </div>
  );
};

// Memoize the component
export const SearchSuggestions = memo(SearchSuggestionsComponent);
SearchSuggestions.displayName = 'SearchSuggestions';
export default SearchSuggestions;