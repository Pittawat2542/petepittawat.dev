import { AnimatePresence } from 'framer-motion';
import { Dialog } from './ui/dialog';
import { SearchDialogContent } from './search/SearchDialogContent';
import { SearchEmptyState } from './search/SearchEmptyState';
import { SearchHeader } from './search/SearchHeader';
import { SearchResultList } from './search/SearchResultList';
import { SearchSkeleton } from './search/SearchSkeleton';
import { SearchSuggestions } from './search/SearchSuggestions';
import { SearchTriggers } from './search/SearchTriggers';
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
      <SearchTriggers hideTriggers={hideTriggers} />
      <AnimatePresence>
        {open && (
          <SearchDialogContent>
            <SearchHeader
              query={query}
              onQueryChange={setQuery}
              filtered={filtered}
              typeFilter={typeFilter}
              countsByType={countsByType}
              onToggleType={toggleType}
              onSelectAllTypes={selectAllTypes}
              showRecent={showRecent}
              recent={recent}
              onSelectFromRecent={setQueryFromRecent}
              onClearRecent={clearRecent}
            />
            <div className="relative max-h-[60dvh] md:max-h-[60vh] overflow-y-auto p-3 md:p-4">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-3 bg-gradient-to-b from-card/80 to-transparent" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-3 bg-gradient-to-t from-card/80 to-transparent" />
              {!loaded && <SearchSkeleton />}
              {showSuggestions && <SearchSuggestions suggestions={suggestions} />}
              {showEmpty && <SearchEmptyState suggestions={suggestions} />}
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
          </SearchDialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
}

