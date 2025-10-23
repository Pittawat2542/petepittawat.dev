/**
 * Search functionality management for header
 */

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
      } catch {}

      fetch('/search.json').catch(() => {});
    };

    const openSearchLazy = async () => {
      try {
        const module = await import('@/scripts/openSearch');
        module.openSearch();
      } catch (e) {
        console.warn('Failed to open search modal', e);
      }
    };

    const registerButton = (button: Element | null) => {
      if (!button || !(button instanceof HTMLButtonElement) || trackedButtons.has(button)) {
        return;
      }
      trackedButtons.add(button);
      button.addEventListener('click', openSearchLazy);
      button.addEventListener('mouseenter', prefetchSearchIndex, { once: true, passive: true });
      button.addEventListener('focus', prefetchSearchIndex, { once: true });
      button.addEventListener('touchstart', prefetchSearchIndex, { once: true, passive: true });
    };

    const connectButtons = () => {
      registerButton(document.getElementById('open-search-desktop'));
      registerButton(document.getElementById('open-search-mobile'));
      registerButton(document.getElementById('open-search-drawer'));
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
        openSearchLazy();
      }
    };

    window.addEventListener('keydown', handleKeydown);

    return () => {
      trackedButtons.forEach(button => {
        button.removeEventListener('click', openSearchLazy);
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
