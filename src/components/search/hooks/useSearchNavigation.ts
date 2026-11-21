import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { buildHref } from '../utils';
import type { AugmentedSearchItem } from '../types';

export const searchResultsId = 'site-search-results';
export const searchResultId = (index: number) => `${searchResultsId}-${index}`;

export function useSearchNavigation(
  results: AugmentedSearchItem[],
  query: string,
  onItemSelected: (item: AugmentedSearchItem) => void
) {
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const row = listRef.current?.children[activeIndex];
    const scroller = listRef.current?.parentElement;
    if (!row || !scroller) return;
    const rowBounds = row.getBoundingClientRect();
    const scrollBounds = scroller.getBoundingClientRect();
    if (rowBounds.top < scrollBounds.top) {
      scroller.scrollTop += rowBounds.top - scrollBounds.top;
    } else if (rowBounds.bottom > scrollBounds.bottom) {
      scroller.scrollTop += rowBounds.bottom - scrollBounds.bottom;
    }
  }, [activeIndex]);

  const getHref = useCallback((item: AugmentedSearchItem) => buildHref(item, query), [query]);

  const onResultKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const { key, nativeEvent } = event;
    // Safari can clear isComposing before it dispatches the confirming Enter.
    if (
      !results.length ||
      nativeEvent.isComposing ||
      (key === 'Enter' && nativeEvent.keyCode === 229)
    )
      return;

    switch (key) {
      case 'ArrowDown':
      case 'ArrowUp':
      case 'PageDown':
      case 'PageUp': {
        event.preventDefault();
        const step = key.startsWith('Page') ? 5 : 1;
        const offset = key.endsWith('Down') ? step : -step;
        setActiveIndex(index => Math.max(0, Math.min(index + offset, results.length - 1)));
        break;
      }
      case 'Home':
      case 'End':
        event.preventDefault();
        setActiveIndex(key === 'Home' ? 0 : results.length - 1);
        break;
      case 'Enter': {
        const item = results[activeIndex];
        if (!item) return;
        event.preventDefault();
        const href = getHref(item);
        onItemSelected(item);
        if (event.metaKey || event.ctrlKey) {
          window.open(href, '_blank', 'noopener,noreferrer');
        } else {
          window.location.assign(href);
        }
        break;
      }
    }
  };

  return { activeIndex, setActiveIndex, listRef, inputRef, onResultKeyDown, getHref };
}
