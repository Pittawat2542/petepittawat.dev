import assert from 'node:assert/strict';
import test from 'node:test';

import { computeBlogPostMetadata } from './blog-post-schema.ts';

test('computes locale-specific OG fallback image URLs for English blog posts', () => {
  const metadata = computeBlogPostMetadata({
    slug: 'agentic-workflows',
    lang: 'en',
    tags: ['AI'],
    site: new URL('https://petepittawat.dev'),
  });

  assert.equal(metadata.imageUrl, 'https://petepittawat.dev/og/blog/en/agentic-workflows.png');
});

test('computes locale-specific OG fallback image URLs for Thai blog posts', () => {
  const metadata = computeBlogPostMetadata({
    slug: 'agentic-workflows',
    lang: 'th',
    tags: ['AI'],
    site: new URL('https://petepittawat.dev'),
  });

  assert.equal(metadata.imageUrl, 'https://petepittawat.dev/og/blog/th/agentic-workflows.png');
});
