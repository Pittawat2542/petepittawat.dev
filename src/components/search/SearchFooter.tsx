import type { FC } from 'react';
import { memo } from 'react';
import { CornerDownLeft, ArrowUp, ArrowDown } from 'lucide-react';

interface SearchFooterProps {
  readonly onShowMore?: () => void;
  readonly visibleCount: number;
  readonly hasQuery: boolean;
  readonly resultCount: number;
  readonly isTagSearch?: boolean;
  readonly tagCount?: number;
}

const SearchFooterComponent: FC<SearchFooterProps> = ({
  resultCount,
  onShowMore,
  visibleCount,
  hasQuery,
  isTagSearch = false,
  tagCount = 0,
}) => {
  const showTagCount = isTagSearch && resultCount === 0;

  return (
    <footer className="search-modal__footer" aria-label="Search navigation help">
      <div className="hidden flex-wrap items-center gap-4 sm:flex">
        <span className="flex items-center gap-1.5">
          <kbd className="type-micro inline-flex h-5 items-center justify-center rounded border border-white/10 bg-white/5 px-1.5 font-mono font-medium text-white/70">
            <ArrowUp size={10} aria-hidden="true" />
            <span className="sr-only">Up Arrow</span>
          </kbd>
          <kbd className="type-micro inline-flex h-5 items-center justify-center rounded border border-white/10 bg-white/5 px-1.5 font-mono font-medium text-white/70">
            <ArrowDown size={10} aria-hidden="true" />
            <span className="sr-only">Down Arrow</span>
          </kbd>
          <span className="text-muted-foreground">to navigate</span>
        </span>
        <span className="flex items-center gap-1.5">
          <kbd className="type-micro inline-flex h-5 items-center justify-center rounded border border-white/10 bg-white/5 px-1.5 font-mono font-medium text-white/70">
            <CornerDownLeft size={10} aria-hidden="true" />
            <span className="sr-only">Enter</span>
          </kbd>
          <span className="text-muted-foreground">to select</span>
        </span>
        <span className="flex items-center gap-1.5">
          <kbd className="type-micro inline-flex h-5 items-center justify-center rounded border border-white/10 bg-white/5 px-1.5 font-mono font-medium text-white/70">
            esc
          </kbd>
          <span className="text-muted-foreground">to close</span>
        </span>
      </div>
      <div className="flex items-center gap-3">
        {onShowMore && (
          <button type="button" className="search-type-chip min-h-11" onClick={onShowMore}>
            Show more
          </button>
        )}
        <span role="status" className="text-muted-foreground font-mono font-medium tabular-nums">
          {hasQuery &&
            (showTagCount
              ? `${tagCount} ${tagCount === 1 ? 'tag' : 'tags'}`
              : visibleCount < resultCount
                ? `${visibleCount} of ${resultCount} results`
                : `${resultCount} ${resultCount === 1 ? 'result' : 'results'}`)}
        </span>
      </div>
    </footer>
  );
};

export const SearchFooter = memo(SearchFooterComponent);
SearchFooter.displayName = 'SearchFooter';
export default SearchFooter;
