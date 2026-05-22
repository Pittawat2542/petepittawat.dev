import type { FC } from 'react';
import { memo } from 'react';
import { Inbox } from 'lucide-react';

interface Suggestion {
  readonly id: string;
  readonly title: string;
  readonly localizedUrl: string;
}

interface SearchEmptyStateProps {
  readonly suggestions: readonly Suggestion[];
}

const SearchEmptyStateComponent: FC<SearchEmptyStateProps> = ({ suggestions }) => {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/40">
        <Inbox size={20} aria-hidden="true" />
      </div>
      <h3 className="mb-1 text-sm font-semibold text-white/95">No results found</h3>
      <p className="mb-6 max-w-[280px] text-xs leading-relaxed text-white/40">
        We could not find anything matching your search. Try using a different keyword or explore
        suggestions below.
      </p>

      {suggestions.length > 0 && (
        <div className="grid w-full max-w-sm grid-cols-3 gap-2 sm:flex sm:max-w-xl sm:flex-wrap sm:justify-center">
          {suggestions.map(suggestion => (
            <a key={suggestion.id} href={suggestion.localizedUrl} className="search-badge">
              {suggestion.title}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export const SearchEmptyState = memo(SearchEmptyStateComponent);
SearchEmptyState.displayName = 'SearchEmptyState';
export default SearchEmptyState;
