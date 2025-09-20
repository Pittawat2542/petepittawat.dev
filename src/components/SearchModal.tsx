import { Command, Search as SearchIcon, CornerDownLeft, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { Dialog, DialogContent, DialogTrigger, DialogClose, DialogTitle, DialogDescription } from './ui/dialog';
import SearchInput from './ui/SearchInput';
import { cn } from '../lib/utils';
import { SearchFilterChips } from './search/SearchFilterChips';
import { SearchResultList } from './search/SearchResultList';
import { useSearchController } from './search/useSearchController';

type SearchModalProps = {
  autoOpen?: boolean;
  hideTriggers?: boolean;
  openKey?: number;
};

export default function SearchModal({ autoOpen = false, hideTriggers = false, openKey }: SearchModalProps = {}) {
  const {
    state: { open, query, loaded, filtered, suggestions, recent, countsByType, typeFilter, activeIndex },
    actions: {
      setQuery,
      setActiveIndex,
      toggleType,
      selectAllTypes,
      clearRecent,
      setQueryFromRecent,
      handleOpenChange,
      getHref,
      handleResultClick,
    },
    refs: { listRef },
  } = useSearchController({ autoOpen, openKey });

  const trimmedQuery = query.trim();
  const hasQuery = trimmedQuery.length > 0;
  const showRecent = open && loaded && !hasQuery && recent.length > 0;
  const showSuggestions = loaded && !hasQuery;
  const showResults = loaded && hasQuery && filtered.length > 0;
  const showEmpty = loaded && hasQuery && filtered.length === 0;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {!hideTriggers && (
        <>
          <DialogTrigger asChild>
            <button
              className={cn(
                'hidden md:inline-flex items-center gap-2 rounded-full px-3 py-2',
                'text-sm hover:bg-[color:var(--white)]/5 transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--white)]/30'
              )}
              aria-label="Open search"
              title="Search (⌘/Ctrl + K)"
            >
              <SearchIcon size={16} className="opacity-80" />
              <span className="opacity-90">Search</span>
              <span className="ml-2 hidden lg:inline-flex items-center gap-1 rounded-md border border-white/10 px-1.5 py-0.5 text-xs text-white/70">
                <Command size={12} />K
              </span>
            </button>
          </DialogTrigger>
          <DialogTrigger asChild>
            <button
              className={cn(
                'md:hidden inline-flex items-center justify-center rounded-full p-2',
                'hover:bg-[color:var(--white)]/10 focus-visible:outline-none',
                'focus-visible:ring-2 focus-visible:ring-[color:var(--white)]/30'
              )}
              aria-label="Open search"
              title="Search"
            >
              <SearchIcon size={18} className="opacity-90" />
            </button>
          </DialogTrigger>
        </>
      )}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          >
            <DialogContent
              className="no-paint-contain max-w-none w-[min(72rem,92vw)] p-0 overflow-visible top-[12vh] -translate-y-0 sm:top-1/2 sm:-translate-y-1/2"
              style={{ overflowY: 'visible' }}
            >
              <DialogTitle className="sr-only">Site Search</DialogTitle>
              <DialogDescription className="sr-only">
                Type to search posts, projects, publications, talks, and pages. Use arrow keys to navigate results.
              </DialogDescription>
              <DialogClose
                className="absolute -top-4 -right-4 z-10 inline-flex items-center justify-center rounded-full p-2.5 border border-white/15 bg-black/40 backdrop-blur-md text-muted-foreground hover:text-foreground hover:bg-white/10 shadow-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                aria-label="Close search"
                title="Close (Esc)"
              >
                <span className="sr-only">Close</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </DialogClose>
              <div className="p-4 md:p-5 lg:p-6 border-b border-border">
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <SearchInput
                      value={query}
                      onChange={setQuery}
                      placeholder="Search posts, projects, publications, talks..."
                      ariaLabel="Universal search"
                      size="lg"
                    />
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground" aria-live="polite">
                  <div className="flex items-center gap-1.5">
                    <span className="hidden sm:inline">Navigate with</span>
                    <kbd className="rounded border px-1 py-0.5">↑</kbd>
                    <kbd className="rounded border px-1 py-0.5">↓</kbd>
                    <span className="inline-flex items-center gap-1"><CornerDownLeft size={12} /> Enter</span>
                    <span className="hidden sm:inline">• Esc to close</span>
                  </div>
                  <div>{filtered.length} results</div>
                </div>
                <SearchFilterChips
                  activeTypes={typeFilter}
                  counts={countsByType}
                  onToggle={toggleType}
                  onSelectAll={selectAllTypes}
                />
                {showRecent && (
                  <RecentSearches recent={recent} onSelect={setQueryFromRecent} onClear={clearRecent} />
                )}
              </div>
              <div className="relative max-h-[60dvh] md:max-h-[60vh] overflow-y-auto p-3 md:p-4">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-3 bg-gradient-to-b from-card/80 to-transparent" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-3 bg-gradient-to-t from-card/80 to-transparent" />
                {!loaded && <SearchSkeleton />}
                {showSuggestions && <Suggestions suggestions={suggestions} />}
                {showEmpty && <EmptyState suggestions={suggestions} />}
                {showResults && (
                  <SearchResultList
                    ref={listRef}
                    items={filtered}
                    activeIndex={activeIndex}
                    getHref={getHref}
                    onItemClick={handleResultClick}
                    onActiveIndexChange={setActiveIndex}
                  />
                )}
              </div>
            </DialogContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Dialog>
  );
}

function RecentSearches({ recent, onSelect, onClear }: { recent: string[]; onSelect: (value: string) => void; onClear: () => void }) {
  return (
    <div className="mt-3 flex flex-wrap items-center gap-2">
      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground"><Clock size={12} /> Recent:</span>
      {recent.map((entry) => (
        <button
          key={entry}
          className="text-xs rounded-full px-3 py-1 border border-white/10 hover:bg-white/5"
          onClick={() => onSelect(entry)}
          aria-label={`Use recent search ${entry}`}
        >
          {entry}
        </button>
      ))}
      <button
        className="ml-1 text-[11px] text-muted-foreground hover:text-foreground underline decoration-dotted"
        onClick={onClear}
        aria-label="Clear recent searches"
      >
        Clear
      </button>
    </div>
  );
}

function SearchSkeleton() {
  return (
    <ul className="divide-y divide-border animate-pulse">
      {Array.from({ length: 6 }).map((_, index) => (
        <li key={index} className="px-4 py-3">
          <div className="h-4 w-24 bg-white/10 rounded mb-2" />
          <div className="h-4 w-3/4 bg-white/10 rounded" />
        </li>
      ))}
    </ul>
  );
}

function Suggestions({ suggestions }: { suggestions: { id: string; title: string; url: string }[] }) {
  if (!suggestions.length) return null;
  return (
    <div className="px-3 py-8 text-sm text-muted-foreground">
      <p className="mb-3">Start typing to search across the site, or explore:</p>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion) => (
          <a key={suggestion.id} href={suggestion.url} className="rounded-full px-3 py-1 border border-white/10 hover:bg-white/5">
            {suggestion.title}
          </a>
        ))}
      </div>
    </div>
  );
}

function EmptyState({ suggestions }: { suggestions: { id: string; title: string; url: string }[] }) {
  return (
    <div className="px-3 py-4 text-sm text-muted-foreground">
      <p className="mb-2">No results. Try a different query or explore:</p>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion) => (
          <a key={suggestion.id} href={suggestion.url} className="rounded-full px-3 py-1 border border-white/10 hover:bg-white/5">
            {suggestion.title}
          </a>
        ))}
      </div>
    </div>
  );
}
