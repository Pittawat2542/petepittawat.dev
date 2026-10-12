/** Compact, framework-independent metadata for static listing interactions. */
export interface ListingItem {
  id: string;
  title: string;
  search: string;
  date: number;
  tags: readonly string[];
  fields: Record<string, string>;
}
export interface ListingState {
  q: string;
  sort: string;
  tags: string[];
  filters: Record<string, string>;
  locale: 'en' | 'th';
}
export function readListingState(url: URL, initialTags: readonly string[] = []): ListingState {
  const p = url.searchParams;
  return {
    q: p.get('q') ?? '',
    sort: ['oldest', 'title-az', 'title-za'].includes(p.get('sort') ?? '')
      ? (p.get('sort') ?? 'newest')
      : 'newest',
    tags: p.has('tag') ? p.getAll('tag') : [...initialTags],
    filters: Object.fromEntries(
      ['year', 'series', 'type', 'mode', 'audience'].map(key => [key, p.get(key) ?? ''])
    ),
    locale: p.get('lang') === 'th' ? 'th' : 'en',
  };
}
export function listingUrl(
  url: URL,
  state: ListingState,
  blog: boolean,
  initialTags: readonly string[] = []
) {
  const next = new URL(url);
  const p = next.searchParams;
  for (const key of ['q', 'sort', 'tag', 'year', 'series', 'type', 'mode', 'audience'])
    p.delete(key);
  if (state.q.trim()) p.set('q', state.q.trim());
  if (state.sort !== 'newest') p.set('sort', state.sort);
  // Explicit empty tag overrides a tag route's default after Clear all.
  for (const tag of state.tags.filter(Boolean).sort()) p.append('tag', tag);
  if (!state.tags.filter(Boolean).length && initialTags.length) p.set('tag', '');
  for (const [key, value] of Object.entries(state.filters))
    if (value && value !== 'all') p.set(key, value);
  if (blog) p.set('lang', state.locale);
  return next;
}
export function selectListing(
  items: readonly ListingItem[],
  state: ListingState,
  minQueryLength = 1
) {
  const query = state.q.trim().toLowerCase();
  const tags = state.tags.filter(Boolean);
  return items
    .filter(
      item =>
        (query.length < minQueryLength || item.search.includes(query)) &&
        (!tags.length || item.tags.some(tag => tags.includes(tag))) &&
        Object.entries(state.filters).every(
          ([key, value]) => !value || value === 'all' || item.fields[key] === value
        )
    )
    .sort((a, b) => {
      if (state.sort === 'title-az') return a.title.localeCompare(b.title);
      if (state.sort === 'title-za') return b.title.localeCompare(a.title);
      return (
        (state.sort === 'oldest' ? a.date - b.date : b.date - a.date) ||
        a.title.localeCompare(b.title)
      );
    });
}
export function listingOptions(items: readonly ListingItem[], fields: readonly string[]) {
  return Object.fromEntries(
    fields.map(key => [
      key,
      [
        ...new Set(
          items.map(item => item.fields[key]).filter((value): value is string => Boolean(value))
        ),
      ].sort((a, b) => (key === 'year' ? Number(b) - Number(a) : a.localeCompare(b))),
    ])
  );
}
export function listingTagCounts(items: readonly ListingItem[]) {
  const counts: Record<string, number> = {};
  for (const item of items)
    for (const tag of new Set(item.tags)) counts[tag] = (counts[tag] ?? 0) + 1;
  return counts;
}
export interface SeriesInfo {
  isPartOfSeries: boolean;
  partNumber: number;
  totalParts: number;
  seriesTitle?: string | undefined;
}
export function buildSeriesIndex<
  T extends {
    id: string;
    data: {
      seriesSlug?: string | undefined;
      seriesTitle?: string | undefined;
      seriesOrder?: number | undefined;
      pubDate: Date;
    };
  },
>(posts: readonly T[]) {
  const groups = new Map<string, T[]>();
  for (const post of posts)
    if (post.data.seriesSlug) {
      const group = groups.get(post.data.seriesSlug) ?? [];
      group.push(post);
      groups.set(post.data.seriesSlug, group);
    }
  const result = new Map<string, SeriesInfo>();
  for (const group of groups.values()) {
    group.sort((a, b) => +a.data.pubDate - +b.data.pubDate);
    group.forEach((post, index) =>
      result.set(post.id, {
        isPartOfSeries: Boolean(post.data.seriesTitle),
        partNumber: post.data.seriesOrder ?? index + 1,
        totalParts: group.length,
        seriesTitle: post.data.seriesTitle,
      })
    );
  }
  return result;
}

/** Accept older search links while keeping the listing's established item IDs. */
export function listingHashTarget(id: string) {
  return id.startsWith('pub-') ? `publication-${id.slice(4)}` : id;
}
