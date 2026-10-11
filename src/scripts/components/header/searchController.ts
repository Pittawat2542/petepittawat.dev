/**
 * Search functionality management for header
 */

import { openSearch } from '@/scripts/openSearch';

export interface SearchController {
  init(): () => void; // Returns cleanup function
}

export function createSearchController(): SearchController {
  const init = () => {
    let prefetched = false;
    const trackedButtons = new Set<HTMLButtonElement>();

    const prefetchSearchIndex = () => {
      if (prefetched) return;
      prefetched = true;

      try {
        // Respect Data Saver
        // @ts-ignore
        if (navigator?.connection?.saveData) return;
      } catch {
        // Ignore browsers without the Network Information API.
      }

      // Search code is hydrated by Astro; warm the index on intent.
      fetch('/search.json').catch(() => {});
    };

    const registerButton = (button: Element | null) => {
      if (!button || !(button instanceof HTMLButtonElement) || trackedButtons.has(button)) {
        return;
      }
      trackedButtons.add(button);
      button.addEventListener('click', openSearch);
      button.addEventListener('mouseenter', prefetchSearchIndex, { once: true, passive: true });
      button.addEventListener('focus', prefetchSearchIndex, { once: true });
      button.addEventListener('touchstart', prefetchSearchIndex, { once: true, passive: true });
    };

    const connectButtons = () => {
      registerButton(document.getElementById('open-search-desktop'));
      registerButton(document.getElementById('open-search-mobile'));
      document
        .querySelectorAll<HTMLButtonElement>('button[aria-label="Open search"]')
        .forEach(registerButton);
    };

    connectButtons();

    if (trackedButtons.size === 0) {
      setTimeout(connectButtons, 150);
    }

    const handleKeydown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        prefetchSearchIndex();
        openSearch();
      }
    };

    window.addEventListener('keydown', handleKeydown);

    return () => {
      trackedButtons.forEach(button => {
        button.removeEventListener('click', openSearch);
        button.removeEventListener('mouseenter', prefetchSearchIndex);
        button.removeEventListener('focus', prefetchSearchIndex);
        button.removeEventListener('touchstart', prefetchSearchIndex);
      });
      trackedButtons.clear();
      window.removeEventListener('keydown', handleKeydown);
    };
  };

  return { init };
}
