/**
 * Search functionality management for header
 */

export interface SearchController {
  init(): () => void; // Returns cleanup function
}

export function createSearchController(): SearchController {
  const init = () => {
    let prefetched = false;

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
        const module = await import('../../openSearch');
        module.openSearch();
      } catch (e) {
        console.warn('Failed to open search modal', e);
      }
    };

    // Find search triggers
    const desktopButton = document.getElementById('open-search-desktop');
    const mobileButton = document.getElementById('open-search-mobile');
    const drawerButton = document.getElementById('open-search-drawer');

    if (!desktopButton || !mobileButton || !drawerButton) {
      // Retry after a short delay if elements aren't ready
      setTimeout(() => init(), 100);
      return () => {};
    }

    // Prefetch on pointer/focus intent
    const triggers = document.querySelectorAll('button[aria-label=\"Open search\"]');
    triggers.forEach(trigger => {
      trigger.addEventListener('mouseenter', prefetchSearchIndex, { once: true, passive: true });
      trigger.addEventListener('focus', prefetchSearchIndex, { once: true });
      trigger.addEventListener('touchstart', prefetchSearchIndex, { once: true, passive: true });
    });

    // Click handlers
    desktopButton.addEventListener('click', openSearchLazy);
    mobileButton.addEventListener('click', openSearchLazy);
    drawerButton.addEventListener('click', openSearchLazy);

    // Keyboard shortcut
    const handleKeydown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        prefetchSearchIndex();
        openSearchLazy();
      }
    };

    window.addEventListener('keydown', handleKeydown);

    // Return cleanup function
    return () => {
      desktopButton?.removeEventListener('click', openSearchLazy);
      mobileButton?.removeEventListener('click', openSearchLazy);
      drawerButton?.removeEventListener('click', openSearchLazy);
      window.removeEventListener('keydown', handleKeydown);
    };
  };

  return { init };
}
