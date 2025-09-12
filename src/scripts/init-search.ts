// Initialize search triggers and lazy load the React SearchModal only when needed

function prefetchSearchIndexOnce() {
  let prefetched = false;
  return () => {
    if (prefetched) return;
    prefetched = true;
    try {
      // Respect Data Saver
      // @ts-ignore
      if (navigator?.connection?.saveData) return;
    } catch {}
    try { fetch('/search.json').catch(() => {}); } catch {}
  };
}

function setup() {
  const prefetch = prefetchSearchIndexOnce();

  const openSearchLazy = async () => {
    try {
      const m = await import('./openSearch.ts');
      m.openSearch();
    } catch (e) {
      console.warn('Failed to open search modal', e);
    }
  };

  // Prefetch on pointer/focus intent
  const triggers = document.querySelectorAll('button[aria-label="Open search"]');
  triggers.forEach((t) => {
    t.addEventListener('mouseenter', prefetch, { once: true, passive: true });
    t.addEventListener('focus', prefetch, { once: true });
    t.addEventListener('touchstart', prefetch, { once: true, passive: true });
  });

  // Click handlers for explicit buttons
  document.getElementById('open-search-desktop')?.addEventListener('click', openSearchLazy);
  document.getElementById('open-search-mobile')?.addEventListener('click', openSearchLazy);
  document.getElementById('open-search-in-menu')?.addEventListener('click', openSearchLazy);

  // Keyboard shortcut
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      prefetch();
      openSearchLazy();
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setup, { once: true });
} else {
  setup();
}
