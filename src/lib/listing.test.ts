import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildSeriesIndex,
  listingOptions,
  listingHashTarget,
  listingTagCounts,
  listingUrl,
  readListingState,
  selectListing,
} from './listing.ts';
import type { ListingItem } from './listing.ts';
const items: ListingItem[] = [
  {
    id: 'b',
    title: 'Beta',
    search: 'beta ai research',
    date: 200,
    tags: ['AI', 'AI'],
    fields: { year: '2026', type: 'paper' },
  },
  {
    id: 'a',
    title: 'Alpha',
    search: 'alpha frontend',
    date: 100,
    tags: ['Web'],
    fields: { year: '2025', type: 'project' },
  },
  {
    id: 'c',
    title: 'Gamma',
    search: 'gamma ai frontend',
    date: 200,
    tags: ['AI', 'Web'],
    fields: { year: '2026', type: 'paper' },
  },
];
test('search, tag OR, and field AND filters preserve stable sorting', () => {
  const state = readListingState(new URL('https://example.com/?q=ai&tag=AI&year=2026'));
  assert.deepEqual(
    selectListing(items, state).map(item => item.id),
    ['b', 'c']
  );
  state.sort = 'title-za';
  assert.deepEqual(
    selectListing(items, state).map(item => item.id),
    ['c', 'b']
  );
  state.q = '';
  state.tags = ['AI', 'Web'];
  state.filters = {};
  state.sort = 'oldest';
  assert.equal(selectListing(items, state).length, 3);
  state.q = 'unmatched';
  assert.equal(selectListing(items, state).length, 0);
});
test('tag routes are filtered before hydration; explicit clearing survives reload', () => {
  const url = new URL('https://example.com/tags/ai/');
  const state = readListingState(url, ['AI']);
  assert.equal(selectListing(items, state).length, 2);
  state.tags = [];
  const cleared = listingUrl(url, state, true, ['AI']);
  assert.deepEqual(readListingState(cleared, ['AI']).tags, ['']);
  assert.equal(selectListing(items, readListingState(cleared, ['AI'])).length, 3);
});
test('URL state preserves anchors and unrelated parameters and restores removed filters', () => {
  const url = new URL(
    'https://example.com/publications/?utm_source=test&q=old#publication-item-2026'
  );
  const state = readListingState(url);
  state.q = 'new';
  state.filters = { year: '2026' };
  const next = listingUrl(url, state, false);
  assert.equal(next.hash, url.hash);
  assert.equal(next.searchParams.get('utm_source'), 'test');
  assert.equal(next.searchParams.get('q'), 'new');
  assert.equal(next.searchParams.has('tag'), false);
  state.filters = {};
  assert.equal(listingUrl(next, state, false).searchParams.has('year'), false);
  assert.equal(readListingState(new URL('https://example.com/?sort=invalid')).sort, 'newest');
});
test('options and counts are calculated once without double counting tags', () => {
  assert.deepEqual(listingOptions(items, ['year'])['year'], ['2026', '2025']);
  assert.deepEqual(listingTagCounts(items), { AI: 2, Web: 2 });
});
test('series index honors explicit orders and computes date-based fallback', () => {
  const posts = [
    { id: 'late', data: { seriesSlug: 's', seriesTitle: 'Series', pubDate: new Date(200) } },
    {
      id: 'early',
      data: { seriesSlug: 's', seriesTitle: 'Series', pubDate: new Date(100), seriesOrder: 4 },
    },
  ];
  const index = buildSeriesIndex(posts);
  assert.equal(index.get('early')?.partNumber, 4);
  assert.equal(index.get('late')?.partNumber, 2);
  assert.equal(index.get('late')?.totalParts, 2);
  assert.equal(posts[0]?.id, 'late');
});
test('large lists keep all items available and use precomputed search metadata', () => {
  const many = Array.from({ length: 500 }, (_, i) => ({
    ...(items[i % items.length] as ListingItem),
    id: String(i),
  }));
  const state = readListingState(new URL('https://example.com/'));
  assert.equal(selectListing(many, state).length, 500);
  state.q = 'frontend';
  assert.equal(selectListing(many, state).length, 333);
});

test('publication deep links accept both current and previous search anchors', () => {
  assert.equal(listingHashTarget('pub-paper-2026'), 'publication-paper-2026');
  assert.equal(listingHashTarget('publication-paper-2026'), 'publication-paper-2026');
  assert.equal(listingHashTarget('project-paper-2026'), 'project-paper-2026');
});
