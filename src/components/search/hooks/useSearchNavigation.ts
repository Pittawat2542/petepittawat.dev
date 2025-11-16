/**
 * useSearchNavigation - Responsible for keyboard navigation through search results
 * Follows Single Responsibility Principle (SRP)
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { navigationService } from '@/lib/services';
import { buildHref } from '../utils';
import type { AugmentedSearchItem } from '../types';

export function useSearchNavigation(
  results: AugmentedSearchItem[],
  query: string,
  isActive: boolean,
  onItemSelected: (item: AugmentedSearchItem) => void
) {
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef<HTMLUListElement | null>(null);

  // Reset active index when results change
  useEffect(() => {
    setActiveIndex(0);
  }, [results, isActive]);

  // Scroll active item into view
  useEffect(() => {
    const element = listRef.current?.children[activeIndex] as HTMLElement | undefined;
    element?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isActive) return;

    const handler = (event: KeyboardEvent) => {
      if (!results.length) return;

      const key = event.key;

      if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End'].includes(key)) {
        event.preventDefault();
      }

      if (key === 'ArrowDown') setActiveIndex(index => Math.min(index + 1, results.length - 1));
      if (key === 'ArrowUp') setActiveIndex(index => Math.max(index - 1, 0));
      if (key === 'PageDown') setActiveIndex(index => Math.min(index + 5, results.length - 1));
      if (key === 'PageUp') setActiveIndex(index => Math.max(index - 5, 0));
      if (key === 'Home') setActiveIndex(0);
      if (key === 'End') setActiveIndex(results.length - 1);

      if (key === 'Enter') {
        const item = results[activeIndex];
        if (!item) return;

        const href = buildHref(item, query);
        onItemSelected(item);

        if (event.metaKey || event.ctrlKey) {
          navigationService.openInNewTab(href);
        } else {
          navigationService.navigate(href);
        }
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isActive, results, activeIndex, query, onItemSelected]);

  const getHref = useCallback((item: AugmentedSearchItem) => buildHref(item, query), [query]);

  return {
    activeIndex,
    setActiveIndex,
    listRef,
    getHref,
  };
}
