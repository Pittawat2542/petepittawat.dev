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

    const prefetchSearchModal = () => {
      if (prefetched) return;
      prefetched = true;

      try {
        // Respect Data Saver
        // @ts-ignore
        if (navigator?.connection?.saveData) return;
      } catch {
        // Ignore browsers without the Network Information API.
      }

      // Prefetch both index and code
      fetch('/search.json').catch(() => {});
      import('@/scripts/openSearch').catch(() => {});
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
      button.addEventListener('mouseenter', prefetchSearchModal, { once: true, passive: true });
      button.addEventListener('focus', prefetchSearchModal, { once: true });
      button.addEventListener('touchstart', prefetchSearchModal, { once: true, passive: true });
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
        prefetchSearchModal();
        openSearchLazy();
      }
    };

    window.addEventListener('keydown', handleKeydown);

    return () => {
      trackedButtons.forEach(button => {
        button.removeEventListener('click', openSearchLazy);
        button.removeEventListener('mouseenter', prefetchSearchModal);
        button.removeEventListener('focus', prefetchSearchModal);
        button.removeEventListener('touchstart', prefetchSearchModal);
      });
      trackedButtons.clear();
      window.removeEventListener('keydown', handleKeydown);
    };
  };

  return { init };
}
