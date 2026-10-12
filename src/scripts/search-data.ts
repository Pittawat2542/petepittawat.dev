import type { SearchItem } from '@/components/search/types';
let pending: Promise<SearchItem[]> | undefined;
/** One request shared by intent warming and the search dialog; failures can retry. */
export function loadSearchData() {
  pending ??= fetch('/search.json')
    .then(async response => {
      if (!response.ok) throw new Error(`Search index request failed: ${response.status}`);
      const data = (await response.json()) as { items?: SearchItem[] };
      return data.items ?? [];
    })
    .catch(error => {
      pending = undefined;
      throw error;
    });
  return pending;
}
