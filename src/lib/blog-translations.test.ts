import assert from 'node:assert/strict';
import test from 'node:test';

import {
  getAlternateBlogPost,
  getBlogExclusiveLocaleLabel,
  getBlogPostLanguageState,
  getBlogPostPath,
  getBlogPostsForLocale,
  getPreferredBlogPostStates,
  getPreferredBlogPosts,
  groupBlogPostsByTranslation,
} from './blog-translations.ts';

type BlogPostFixture = {
  id: string;
  data: {
    slug: string;
    routeSlug?: string | undefined;
    lang: 'en' | 'th';
    translationId?: string | undefined;
  };
};

const pairedEn: BlogPostFixture = {
  id: 'paired-en',
  data: {
    slug: 'paired-en',
    lang: 'en',
    translationId: 'paired',
  },
};

const pairedTh: BlogPostFixture = {
  id: 'paired-th',
  data: {
    slug: 'paired-th',
    lang: 'th',
    translationId: 'paired',
  },
};

const thaiOnly: BlogPostFixture = {
  id: 'thai-only',
  data: {
    slug: 'thai-only',
    lang: 'th',
    translationId: 'thai-only',
  },
};

const englishOnly: BlogPostFixture = {
  id: 'english-only',
  data: {
    slug: 'english-only',
    lang: 'en',
    translationId: 'english-only',
  },
};

test('returns only real blog variants for the requested locale without fallback', () => {
  const grouped = groupBlogPostsByTranslation([pairedEn, pairedTh, thaiOnly, englishOnly]);

  assert.deepEqual(
    getBlogPostsForLocale(grouped, 'en').map(post => post.data.slug),
    ['paired-en', 'english-only']
  );
  assert.deepEqual(
    getBlogPostsForLocale(grouped, 'th').map(post => post.data.slug),
    ['paired-th', 'thai-only']
  );
});

test('prefers English for discovery pages while keeping Thai-only posts discoverable', () => {
  const grouped = groupBlogPostsByTranslation([pairedEn, pairedTh, thaiOnly, englishOnly]);

  assert.deepEqual(
    getPreferredBlogPosts(grouped, 'en').map(post => post.data.slug),
    ['paired-en', 'thai-only', 'english-only']
  );
});

test('returns the sibling variant only for actual translation pairs', () => {
  const grouped = groupBlogPostsByTranslation([pairedEn, pairedTh, thaiOnly, englishOnly]);

  assert.equal(getAlternateBlogPost(pairedEn, grouped)?.data.slug, 'paired-th');
  assert.equal(getAlternateBlogPost(pairedTh, grouped)?.data.slug, 'paired-en');
  assert.equal(getAlternateBlogPost(thaiOnly, grouped), undefined);
  assert.equal(getAlternateBlogPost(englishOnly, grouped), undefined);
});

test('builds post URLs from the post language only', () => {
  assert.equal(getBlogPostPath(pairedEn), '/blog/paired-en/');
  assert.equal(getBlogPostPath(pairedTh), '/th/blog/paired-th/');
  assert.equal(getBlogPostPath(thaiOnly), '/th/blog/thai-only/');
});

test('prefers routeSlug for public URLs when present', () => {
  const routed: BlogPostFixture = {
    id: 'routed',
    data: {
      slug: 'the-silicon-mind-en',
      routeSlug: 'the-silicon-mind',
      lang: 'en',
      translationId: 'the-silicon-mind',
    },
  };

  assert.equal(getBlogPostPath(routed), '/blog/the-silicon-mind/');
});

test('builds locale-aware list states with explicit fallback metadata', () => {
  const grouped = groupBlogPostsByTranslation([pairedEn, pairedTh, thaiOnly, englishOnly]);
  const preferredStates = getPreferredBlogPostStates(grouped, 'en');

  assert.deepEqual(
    preferredStates.map(state => ({
      slug: state.current.data.slug,
      isFallback: state.isFallback,
      availableLocales: state.availableLocales,
    })),
    [
      {
        slug: 'paired-en',
        isFallback: false,
        availableLocales: ['en', 'th'],
      },
      {
        slug: 'thai-only',
        isFallback: true,
        availableLocales: ['th'],
      },
      {
        slug: 'english-only',
        isFallback: false,
        availableLocales: ['en'],
      },
    ]
  );
});

test('describes per-post language availability for paired and single-language posts', () => {
  const grouped = groupBlogPostsByTranslation([pairedEn, pairedTh, thaiOnly, englishOnly]);

  const pairedState = getBlogPostLanguageState(pairedEn, grouped);
  assert.equal(pairedState.availability.en.isCurrent, true);
  assert.equal(pairedState.availability.th.available, true);
  assert.equal(pairedState.availability.th.href, '/th/blog/paired-th/');

  const thaiOnlyState = getBlogPostLanguageState(thaiOnly, grouped);
  assert.equal(thaiOnlyState.availability.th.isCurrent, true);
  assert.equal(thaiOnlyState.availability.en.available, false);
  assert.equal(thaiOnlyState.availability.en.href, undefined);
});

test('returns concise fallback labels for single-language entries', () => {
  assert.equal(getBlogExclusiveLocaleLabel('en'), 'English only');
  assert.equal(getBlogExclusiveLocaleLabel('th'), 'Thai only');
});
