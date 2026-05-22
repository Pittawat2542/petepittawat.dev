import type { FC } from 'react';
import { memo } from 'react';
import { CornerDownLeft, ArrowUp, ArrowDown } from 'lucide-react';

interface SearchFooterProps {
  readonly resultCount: number;
  readonly isTagSearch?: boolean;
  readonly tagCount?: number;
}

const SearchFooterComponent: FC<SearchFooterProps> = ({
  resultCount,
  isTagSearch = false,
  tagCount = 0,
}) => {
  const showTagCount = isTagSearch && resultCount === 0;

  return (
    <footer className="search-modal__footer" aria-label="Search navigation help">
      <div className="hidden flex-wrap items-center gap-4 sm:flex">
        <span className="flex items-center gap-1.5">
          <kbd className="inline-flex h-5 items-center justify-center rounded border border-white/10 bg-white/5 px-1.5 font-mono text-[10px] font-medium text-white/70">
            <ArrowUp size={10} />
          </kbd>
          <kbd className="inline-flex h-5 items-center justify-center rounded border border-white/10 bg-white/5 px-1.5 font-mono text-[10px] font-medium text-white/70">
            <ArrowDown size={10} />
          </kbd>
          <span className="text-white/40">to navigate</span>
        </span>
        <span className="flex items-center gap-1.5">
          <kbd className="inline-flex h-5 items-center justify-center rounded border border-white/10 bg-white/5 px-1.5 font-mono text-[10px] font-medium text-white/70">
            <CornerDownLeft size={10} />
          </kbd>
          <span className="text-white/40">to select</span>
        </span>
        <span className="flex items-center gap-1.5">
          <kbd className="inline-flex h-5 items-center justify-center rounded border border-white/10 bg-white/5 px-1.5 font-mono text-[10px] font-medium text-white/70">
            esc
          </kbd>
          <span className="text-white/40">to close</span>
        </span>
      </div>
      <div className="font-mono font-medium text-white/50 tabular-nums">
        {showTagCount
          ? `${tagCount} ${tagCount === 1 ? 'tag' : 'tags'}`
          : `${resultCount} ${resultCount === 1 ? 'result' : 'results'}`}
      </div>
    </footer>
  );
};

export const SearchFooter = memo(SearchFooterComponent);
SearchFooter.displayName = 'SearchFooter';
export default SearchFooter;
