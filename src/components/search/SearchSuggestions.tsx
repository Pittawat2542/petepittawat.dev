import '@/styles/components/search-suggestions.css';

import type { FC } from 'react';
import { memo } from 'react';
import { Compass } from 'lucide-react';

interface Suggestion {
  readonly id: string;
  readonly title: string;
  readonly localizedUrl: string;
}

interface SearchSuggestionsProps {
  readonly suggestions: readonly Suggestion[];
}

const SearchSuggestionsComponent: FC<SearchSuggestionsProps> = ({ suggestions }) => {
  if (!suggestions.length) return null;

  return (
    <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/40">
        <Compass size={20} className="animate-spin-slow" aria-hidden="true" />
      </div>
      <h3 className="mb-1 text-sm font-semibold text-white/95">Discover Pete&apos;s Space</h3>
      <p className="mb-6 max-w-[280px] text-xs leading-relaxed text-white/40">
        Search for articles, projects, talks, and publications, or jump directly to one of our main
        pages:
      </p>

      <div className="grid w-full max-w-sm grid-cols-3 gap-2 sm:flex sm:max-w-xl sm:flex-wrap sm:justify-center">
        {suggestions.map(suggestion => (
          <a key={suggestion.id} href={suggestion.localizedUrl} className="search-badge">
            {suggestion.title}
          </a>
        ))}
      </div>
    </div>
  );
};

export const SearchSuggestions = memo(SearchSuggestionsComponent);
SearchSuggestions.displayName = 'SearchSuggestions';
export default SearchSuggestions;
