import type { SearchItem } from '../components/search/types.ts';
import type { SiteCopy } from '../data/site/copy.ts';

type ListingPageKey = keyof SiteCopy['listingPages'];

const PAGE_SEARCH_KEYS = [
  'home',
  'blog',
  'projects',
  'research',
  'publications',
  'talks',
  'about',
] as const satisfies readonly ListingPageKey[];

export function buildPageSearchItems(copy: SiteCopy): SearchItem[] {
  return PAGE_SEARCH_KEYS.map(key => {
    const page = copy.listingPages[key];
    return {
      id: `page:${key}`,
      type: 'page',
      locale: 'en',
      availableLocales: ['en'],
      title: page.title,
      description: page.searchDescription,
      localizedUrl: page.path,
    };
  });
}
