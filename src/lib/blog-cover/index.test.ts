import assert from 'node:assert/strict';
import test from 'node:test';

import {
  getBlogCoverDecorationSpec,
  getBlogCoverTextLayout,
  getBlogCoverTheme,
  getBlogOgImagePath,
  getBlogOgManifestKey,
  resolveBlogCoverSpec,
  type BlogCoverViewport,
} from './index.ts';

const ogViewport: BlogCoverViewport = {
  width: 1200,
  height: 630,
  variant: 'og',
};

const heroViewport: BlogCoverViewport = {
  width: 1200,
  height: 630,
  variant: 'hero',
};

test('returns locale-specific OG image paths for the same route slug', () => {
  assert.equal(
    getBlogOgImagePath({ lang: 'en', routeSlug: 'paired-post' }),
    '/og/blog/en/paired-post.png'
  );
  assert.equal(
    getBlogOgImagePath({ lang: 'th', routeSlug: 'paired-post' }),
    '/og/blog/th/paired-post.png'
  );
});

test('uses locale-specific manifest keys so translation pairs do not overwrite each other', () => {
  assert.equal(getBlogOgManifestKey({ lang: 'en', routeSlug: 'paired-post' }), 'en:paired-post');
  assert.equal(getBlogOgManifestKey({ lang: 'th', routeSlug: 'paired-post' }), 'th:paired-post');
  assert.notEqual(
    getBlogOgManifestKey({ lang: 'en', routeSlug: 'paired-post' }),
    getBlogOgManifestKey({ lang: 'th', routeSlug: 'paired-post' })
  );
});

test('resolves the same cover spec deterministically for the same post input', () => {
  const input = {
    title: 'Agentic Workflows in Practice',
    excerpt: 'A field guide to working with tool-using models.',
    lang: 'en' as const,
    routeSlug: 'agentic-workflows',
    tags: ['AI', 'Agents', 'Workflow'],
    pubDate: new Date('2026-01-15T00:00:00.000Z'),
  };

  assert.deepEqual(resolveBlogCoverSpec(input), resolveBlogCoverSpec(input));
});

test('maps known tags to stable themes and unknown tags to the default theme', () => {
  assert.equal(getBlogCoverTheme('Flutter').id, 'flutter');
  assert.equal(getBlogCoverTheme('AI').id, 'ai');
  assert.equal(getBlogCoverTheme('Unmapped Tag').id, 'default');
});

test('deduplicates tags while preserving the first occurrence order', () => {
  const spec = resolveBlogCoverSpec({
    title: 'Deduped tags',
    excerpt: 'Tag cleanup',
    lang: 'en',
    routeSlug: 'deduped-tags',
    tags: ['AI', 'Philosophy', 'ai', 'AI ', 'philosophy'],
    pubDate: new Date('2026-01-15T00:00:00.000Z'),
  });

  assert.deepEqual(spec.tags, ['AI', 'Philosophy']);
  assert.equal(spec.primaryTag, 'AI');
});

test('builds a responsive text layout for long English titles without overflowing line limits', () => {
  const spec = resolveBlogCoverSpec({
    title:
      'The Common Language of Knowledge: How AI Connects Research, Engineering, and Practical Systems',
    excerpt: 'Long-form essay',
    lang: 'en',
    routeSlug: 'the-common-language-of-knowledge',
    tags: ['AI', 'Philosophy'],
    pubDate: new Date('2026-01-15T00:00:00.000Z'),
  });

  const layout = getBlogCoverTextLayout(spec, ogViewport);

  assert.ok(layout.lines.length >= 2);
  assert.ok(layout.lines.length <= 4);
  assert.ok(layout.fontSize < 72);
  assert.ok(layout.lineHeight > layout.fontSize);
});

test('builds a locale-aware text layout for Thai titles without empty lines', () => {
  const spec = resolveBlogCoverSpec({
    title: 'ภาษากลางของความรู้ เมื่อ AI เชื่อมงานวิจัย วิศวกรรม และการนำไปใช้จริงเข้าด้วยกัน',
    excerpt: 'บทความภาษาไทย',
    lang: 'th',
    routeSlug: 'the-common-language-of-knowledge',
    tags: ['AI', 'Philosophy'],
    pubDate: new Date('2026-01-15T00:00:00.000Z'),
  });

  const layout = getBlogCoverTextLayout(spec, ogViewport);

  assert.ok(layout.lines.length >= 2);
  assert.ok(layout.lines.length <= 4);
  assert.ok(layout.lines.every(line => line.trim().length > 0));
  assert.ok(layout.fontSize < 72);
});

test('builds decoration specs deterministically for the same seeded cover input', () => {
  const coverSpec = resolveBlogCoverSpec({
    title: 'Agentic Workflows in Practice',
    excerpt: 'A field guide to working with tool-using models.',
    lang: 'en',
    routeSlug: 'agentic-workflows',
    tags: ['AI', 'Agents', 'Workflow'],
    pubDate: new Date('2026-01-15T00:00:00.000Z'),
  });

  assert.deepEqual(
    getBlogCoverDecorationSpec({
      seed: coverSpec.seed,
      motif: coverSpec.theme.motif,
      density: coverSpec.theme.density,
      viewport: heroViewport,
    }),
    getBlogCoverDecorationSpec({
      seed: coverSpec.seed,
      motif: coverSpec.theme.motif,
      density: coverSpec.theme.density,
      viewport: heroViewport,
    })
  );
});

test('uses the same motif family to produce meaningfully different decoration patterns across seeds', () => {
  const first = getBlogCoverDecorationSpec({
    seed: 1001,
    motif: 'orbit',
    density: 0.82,
    viewport: ogViewport,
  });
  const second = getBlogCoverDecorationSpec({
    seed: 2002,
    motif: 'orbit',
    density: 0.82,
    viewport: ogViewport,
  });

  assert.notEqual(first.patternId, second.patternId);
  assert.notDeepEqual(
    first.layers.map(layer => [layer.kind, layer.bounds, layer.family]),
    second.layers.map(layer => [layer.kind, layer.bounds, layer.family])
  );
});

test('keeps non-ambient decoration layers out of the content-safe area across all motif families', () => {
  const motifs = ['orbit', 'grid', 'beam', 'stack', 'wave', 'halo'] as const;

  for (const motif of motifs) {
    const decoration = getBlogCoverDecorationSpec({
      seed: 424242,
      motif,
      density: 0.8,
      viewport: ogViewport,
    });

    for (const layer of decoration.layers) {
      assert.ok(layer.bounds.minX >= 0, `${motif}:${layer.id} minX`);
      assert.ok(layer.bounds.maxX <= ogViewport.width, `${motif}:${layer.id} maxX`);
      assert.ok(layer.bounds.minY >= 0, `${motif}:${layer.id} minY`);
      assert.ok(layer.bounds.maxY <= ogViewport.height, `${motif}:${layer.id} maxY`);

      if (layer.family !== 'ambient') {
        assert.ok(
          layer.bounds.minX >= decoration.safeArea.x - 36,
          `${motif}:${layer.id} intrudes into safe area`
        );
      }
    }
  }
});
