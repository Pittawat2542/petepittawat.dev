/**
 * Search functionality management for header
 */

import type * as SearchModule from '@/scripts/mount-search';
import { loadSearchData } from '@/scripts/search-data';
import { openSearch } from '@/scripts/openSearch';

export interface SearchController {
  init(): () => void; // Returns cleanup function
}

export function createSearchController(): SearchController {
  const init = () => {
    let modulePromise: Promise<typeof SearchModule> | undefined;
    const loadModule = () => {
      modulePromise ??= import('@/scripts/mount-search').catch(error => {
        modulePromise = undefined;
        throw error;
      });
      return modulePromise;
    };
    const requestSearch = () => {
      openSearch();
      void loadModule()
        .then(module => {
          module.mountSearch();
        })
        .catch(() => {
          const host = document.getElementById('search-modal-host');
          if (!host) return;
          host.replaceChildren();
          const retry = document.createElement('button');
          retry.textContent = 'Search could not load. Retry';
          retry.className =
            'fixed top-20 right-6 z-50 rounded-xl border border-white/15 bg-slate-950 px-4 py-3 text-sm text-white shadow-xl';
          retry.addEventListener('click', () => {
            // WebKit can retain a failed module in its module map. A fresh
            // document also recovers stale chunk URLs after a static deployment.
            const resume = new URL(window.location.href);
            resume.searchParams.set('open-search', '1');
            window.location.assign(resume);
          });
          host.append(retry);
          retry.focus();
        });
    };
    const trackedButtons = new Set<HTMLButtonElement>();

    const prefetchSearchIndex = () => {
      try {
        // Respect Data Saver
        // @ts-ignore
        if (navigator?.connection?.saveData) return;
      } catch {
        // Ignore browsers without the Network Information API.
      }

      void loadModule().catch(() => {});
      void loadSearchData().catch(() => {});
    };

    const registerButton = (button: Element | null) => {
      if (!button || !(button instanceof HTMLButtonElement) || trackedButtons.has(button)) {
        return;
      }
      trackedButtons.add(button);
      button.addEventListener('click', requestSearch);
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
        requestSearch();
      }
    };

    window.addEventListener('keydown', handleKeydown);
    window.dispatchEvent(new Event('site:search-ready'));
    const resume = new URL(window.location.href);
    if (resume.searchParams.get('open-search') === '1') {
      resume.searchParams.delete('open-search');
      window.history.replaceState(window.history.state, '', resume);
      [...trackedButtons].find(button => button.getClientRects().length)?.focus();
      requestSearch();
    } else if (document.documentElement.dataset['searchRequested'] === 'true') requestSearch();

    return () => {
      trackedButtons.forEach(button => {
        button.removeEventListener('click', requestSearch);
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
