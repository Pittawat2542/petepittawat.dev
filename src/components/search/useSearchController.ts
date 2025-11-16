/**
 * useSearchController - Orchestrates search functionality
 * Refactored to follow Single Responsibility Principle (SRP)
 * by composing focused hooks instead of handling everything
 */

import type { SearchItemType } from './types';
import { ensureAllTypes } from './utils';
import { useCallback, useEffect, useState } from 'react';
import {
  useSearchData,
  useRecentSearches,
  useKeyboardShortcut,
  useSearchFiltering,
  useSearchNavigation,
} from './hooks';

type UseSearchControllerParams = {
  autoOpen?: boolean;
  openKey?: number;
};

export function useSearchController({ autoOpen = false, openKey }: UseSearchControllerParams) {
  const [open, setOpen] = useState(autoOpen);
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<Set<SearchItemType>>(ensureAllTypes);

  // Initialize auto-open
  useEffect(() => {
    if (autoOpen) setOpen(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle external open trigger
  useEffect(() => {
    if (openKey !== undefined) setOpen(true);
  }, [openKey]);

  // Focused hooks for each responsibility
  const { items, loaded } = useSearchData(open);
  const { recent, saveRecent, clearRecent } = useRecentSearches(open);
  const { filtered, countsByType, suggestions } = useSearchFiltering(items, query, typeFilter);

  // Keyboard shortcut: Cmd/Ctrl+K to open search
  useKeyboardShortcut(
    'k',
    () => {
      setOpen(true);
      setTimeout(() => {
        const el = document.querySelector(
          'input[aria-label="Universal search"]'
        ) as HTMLInputElement | null;
        el?.focus();
      }, 0);
    },
    { ctrl: true, meta: true }
  );

  // Handle item selection
  const handleItemSelected = useCallback(
    (item: { type: string; title: string }) => {
      saveRecent(item.type !== 'page' ? item.title : query);
      setOpen(false);
    },
    [query, saveRecent]
  );

  const { activeIndex, setActiveIndex, listRef, getHref } = useSearchNavigation(
    filtered,
    query,
    open,
    handleItemSelected
  );

  // Type filter management
  const toggleType = useCallback((type: SearchItemType) => {
    setTypeFilter(prev => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      if (next.size === 0) next.add(type);
      return next;
    });
  }, []);

  const selectAllTypes = useCallback(() => setTypeFilter(ensureAllTypes()), []);

  const handleOpenChange = useCallback((next: boolean) => {
    setOpen(next);
    if (!next) setQuery('');
  }, []);

  const handleResultClick = useCallback(
    (item: { type: string; title: string }) => {
      saveRecent(item.type !== 'page' ? item.title : query);
      setOpen(false);
    },
    [query, saveRecent]
  );

  return {
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
      setQueryFromRecent: setQuery,
      handleOpenChange,
      getHref,
      handleResultClick,
    },
    refs: {
      listRef,
    },
  };
}
