import { Dialog } from '@/components/ui/core/dialog';
import type { FC } from 'react';
import { SearchDialogContent } from '@/components/search/SearchDialogContent';
import { SearchEmptyState } from '@/components/search/SearchEmptyState';
import { SearchHeader } from '@/components/search/SearchHeader';
import { SearchResultList } from '@/components/search/SearchResultList';
import { SearchSkeleton } from '@/components/search/SearchSkeleton';
import { SearchSuggestions } from '@/components/search/SearchSuggestions';
import { SearchTriggers } from '@/components/search/SearchTriggers';
import { memo } from 'react';
import { useSearchController } from '@/components/search/useSearchController';

interface SearchModalProps {
  readonly autoOpen?: boolean;
  readonly hideTriggers?: boolean;
  readonly openKey?: number;
}

const SearchModalComponent: FC<SearchModalProps> = ({
  autoOpen = false,
  hideTriggers = false,
  openKey,
}) => {
  const {
    state: {
      open,
      query,
      loaded,
      filtered,
      suggestions,
      recent,
      countsByType,
      typeFilter,
      activeIndex,
    },
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
  } = useSearchController({ autoOpen, ...(openKey !== undefined && { openKey }) });

  const trimmedQuery = query.trim();
  const hasQuery = trimmedQuery.length > 0;
  const showRecent = open && loaded && !hasQuery && recent.length > 0;
  const showSuggestions = loaded && !hasQuery;
  const showResults = loaded && hasQuery && filtered.length > 0;
  const showEmpty = loaded && hasQuery && filtered.length === 0;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <SearchTriggers hideTriggers={hideTriggers} />
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
          <div className="search-modal__content" role="presentation">
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
    </Dialog>
  );
};

// Memoize the component with custom comparison
export const SearchModal = memo(SearchModalComponent, (prevProps, nextProps) => {
  return (
    prevProps.autoOpen === nextProps.autoOpen &&
    prevProps.hideTriggers === nextProps.hideTriggers &&
    prevProps.openKey === nextProps.openKey
  );
});

SearchModal.displayName = 'SearchModal';
export default SearchModal;
