/**
 * useSearchController - Orchestrates search functionality
 * Refactored to follow Single Responsibility Principle (SRP)
 * by composing focused hooks instead of handling everything
 */

import type { SearchItemType } from './types';
import { ensureAllTypes, getActiveSearchLocale } from './utils';
import { useCallback, useEffect, useRef, useState } from 'react';
import { SEARCH_OPEN_EVENT } from '@/scripts/openSearch';
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
  const opener = useRef<HTMLElement | null>(null);
  const rememberOpener = useCallback(() => {
    const active = document.activeElement;
    if (active instanceof HTMLElement && !active.closest('[role="dialog"]'))
      opener.current = active;
  }, []);
  const restoreFocus = useCallback(() => {
    opener.current?.focus();
  }, []);
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<Set<SearchItemType>>(ensureAllTypes);
  const activeLocale = getActiveSearchLocale();

  // Initialize auto-open
  useEffect(() => {
    if (autoOpen) setOpen(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle external open trigger
  useEffect(() => {
    if (openKey !== undefined) setOpen(true);
  }, [openKey]);

  useEffect(() => {
    const openRequestedSearch = () => {
      rememberOpener();
      delete document.documentElement.dataset['searchRequested'];
      setOpen(true);
    };

    window.addEventListener(SEARCH_OPEN_EVENT, openRequestedSearch);
    if (document.documentElement.dataset['searchRequested'] === 'true') {
      openRequestedSearch();
    }
    return () => {
      window.removeEventListener(SEARCH_OPEN_EVENT, openRequestedSearch);
    };
  }, [rememberOpener]);

  // Focused hooks for each responsibility
  const { items, loaded, failed, retry } = useSearchData(open);
  const { recent, saveRecent, clearRecent } = useRecentSearches(open);
  const { filtered, countsByType, suggestions, tagSuggestions } = useSearchFiltering(
    items,
    query,
    typeFilter,
    activeLocale
  );

  // Keyboard shortcut: Cmd/Ctrl+K to open search
  useKeyboardShortcut(
    'k',
    () => {
      rememberOpener();
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

  const selectAllTypes = useCallback(() => {
    setTypeFilter(ensureAllTypes());
  }, []);

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
      failed,
      filtered,
      suggestions,
      recent,
      countsByType,
      typeFilter,
      activeIndex,
      tagSuggestions,
    },
    actions: {
      retry,
      restoreFocus,
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
