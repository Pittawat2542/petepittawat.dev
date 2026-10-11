export const SEARCH_OPEN_EVENT = 'site:open-search';

export function openSearch() {
  // Preserve clicks made before the Astro search island has hydrated.
  document.documentElement.dataset['searchRequested'] = 'true';
  window.dispatchEvent(new Event(SEARCH_OPEN_EVENT));
}
