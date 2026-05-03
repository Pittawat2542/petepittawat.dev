import assert from 'node:assert/strict';
import test from 'node:test';

import { getSuggestedReading } from './blog-recommendations.ts';

interface TestPost {
  id: string;
  data: {
    slug: string;
    title: string;
    excerpt: string;
    tags: string[];
    pubDate: Date;
    seriesSlug?: string;
    seriesTitle?: string;
    seriesOrder?: number;
  };
}

const createPost = (id: string, overrides: Partial<TestPost['data']> = {}): TestPost => ({
  id,
  data: {
    slug: id,
    title: `Post ${id}`,
    excerpt: `Excerpt ${id}`,
    tags: ['General'],
    pubDate: new Date('2026-01-01T00:00:00.000Z'),
    ...overrides,
  },
});

test('returns the next post in a series first and avoids duplicates in fallback matches', () => {
  const current = createPost('series-1', {
    tags: ['AI', 'Tutorial'],
    seriesSlug: 'ai-series',
    seriesTitle: 'AI Series',
    seriesOrder: 1,
    pubDate: new Date('2026-01-10T00:00:00.000Z'),
  });
  const nextInSeries = createPost('series-2', {
    tags: ['AI', 'Tutorial'],
    seriesSlug: 'ai-series',
    seriesTitle: 'AI Series',
    seriesOrder: 2,
    pubDate: new Date('2026-01-12T00:00:00.000Z'),
  });
  const strongerTopicMatch = createPost('topic-strong', {
    tags: ['AI', 'Tutorial', 'MCP'],
    pubDate: new Date('2026-01-15T00:00:00.000Z'),
  });
  const weakerTopicMatch = createPost('topic-weak', {
    tags: ['AI'],
    pubDate: new Date('2026-01-20T00:00:00.000Z'),
  });

  const result = getSuggestedReading<TestPost>(
    [current, nextInSeries, strongerTopicMatch, weakerTopicMatch],
    current
  );

  assert.equal(result.mode, 'series-led');
  assert.deepEqual(
    result.posts.map(post => post.id),
    ['series-2', 'topic-strong']
  );
});

test('ranks topic-led suggestions by shared tag count and then by newer publication date', () => {
  const current = createPost('current', {
    tags: ['Flutter', 'Dart', 'News'],
    pubDate: new Date('2026-01-10T00:00:00.000Z'),
  });
  const twoSharedOlder = createPost('two-shared-older', {
    tags: ['Flutter', 'Dart'],
    pubDate: new Date('2026-01-12T00:00:00.000Z'),
  });
  const twoSharedNewer = createPost('two-shared-newer', {
    tags: ['Flutter', 'News'],
    pubDate: new Date('2026-01-18T00:00:00.000Z'),
  });
  const oneSharedNewest = createPost('one-shared-newest', {
    tags: ['Flutter'],
    pubDate: new Date('2026-01-20T00:00:00.000Z'),
  });
  const noShared = createPost('no-shared', {
    tags: ['Python'],
    pubDate: new Date('2026-01-30T00:00:00.000Z'),
  });

  const result = getSuggestedReading<TestPost>(
    [current, twoSharedOlder, twoSharedNewer, oneSharedNewest, noShared],
    current
  );

  assert.equal(result.mode, 'topic-led');
  assert.deepEqual(
    result.posts.map(post => post.id),
    ['two-shared-newer', 'two-shared-older']
  );
});
