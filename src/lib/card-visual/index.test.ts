import assert from 'node:assert/strict';
import test from 'node:test';

import {
  CARD_VISUAL_RENDER_VERSION,
  createCardVisualHash,
  getCardVisualManifestKey,
  getCardVisualPath,
  isCardVisualStale,
  resolveCardVisualSpec,
} from './index.ts';

test('resolves stable public image paths for each supported collection', () => {
  assert.equal(
    getCardVisualPath({
      collection: 'projects',
      slug: '2026-typhoon-si-med-thinking-4b',
    }),
    '/visual/cards/projects/2026-typhoon-si-med-thinking-4b.png'
  );
  assert.equal(
    getCardVisualPath({
      collection: 'publications',
      slug: '2025-benching-structured-output-benchmark-for-llms',
    }),
    '/visual/cards/publications/2025-benching-structured-output-benchmark-for-llms.png'
  );
  assert.equal(
    getCardVisualPath({
      collection: 'talks',
      slug: '2025-02-15-agentic-ai-context-engineering',
    }),
    '/visual/cards/talks/2025-02-15-agentic-ai-context-engineering.png'
  );
});

test('resolves deterministic specs for the same item input', () => {
  const input = {
    collection: 'projects' as const,
    id: '2026-typhoon-si-med-thinking-4b',
    title: 'Typhoon-Si Med-Thinking 4B',
    tags: ['Large Language Models', 'Reasoning', 'Medical', 'Open Source'],
    type: 'research',
    year: 2026,
  };

  assert.deepEqual(resolveCardVisualSpec(input), resolveCardVisualSpec(input));
});

test('maps collection and content metadata to known themes with default fallback', () => {
  assert.equal(
    resolveCardVisualSpec({
      collection: 'projects',
      id: '2025-typhoon-t1-open-thai-reasoning-model',
      title: 'Typhoon T1: Open Thai Reasoning Model',
      tags: ['Reasoning'],
      type: 'research',
      year: 2025,
    }).theme.id,
    'ai'
  );

  assert.equal(
    resolveCardVisualSpec({
      collection: 'talks',
      id: '2024-01-01-unmapped-talk',
      title: 'Unmapped Talk',
      tags: ['Unmapped Tag'],
      type: 'conference',
      date: '2024-01-01',
    }).theme.id,
    'talk'
  );

  assert.equal(
    resolveCardVisualSpec({
      collection: 'projects',
      id: '2024-unmapped-project',
      title: 'Unmapped Project',
      tags: ['Unmapped Tag'],
      type: 'other',
      year: 2024,
    }).theme.id,
    'project'
  );
});

test('hashes include render version and visual inputs for stale detection', () => {
  const spec = resolveCardVisualSpec({
    collection: 'publications',
    id: '2025-benching-structured-output-benchmark-for-llms',
    title: 'BenchING: Structured Output Benchmark for LLMs',
    tags: ['LLM Evaluation', 'Prompt Engineering', 'PCG', 'Benchmark'],
    type: 'journal',
    year: 2025,
  });

  const hash = createCardVisualHash(spec);

  assert.equal(hash.length, 40);
  assert.equal(hash, createCardVisualHash(spec));
  assert.notEqual(hash, createCardVisualHash({ ...spec, renderVersion: 'changed-version' }));
  assert.equal(CARD_VISUAL_RENDER_VERSION, spec.renderVersion);
});

test('detects stale or missing manifest entries', () => {
  const spec = resolveCardVisualSpec({
    collection: 'talks',
    id: '2025-02-15-agentic-ai-context-engineering',
    title: 'Agentic AI and Context Engineering',
    tags: ['AI', 'Agents'],
    type: 'talk',
    date: '2025-02-15',
  });
  const key = getCardVisualManifestKey(spec);
  const hash = createCardVisualHash(spec);

  assert.equal(isCardVisualStale(spec, {}, false), true);
  assert.equal(
    isCardVisualStale(spec, { [key]: { hash, generatedAt: '2026-05-08T00:00:00.000Z' } }, true),
    false
  );
  assert.equal(
    isCardVisualStale(
      spec,
      { [key]: { hash: 'different-hash', generatedAt: '2026-05-08T00:00:00.000Z' } },
      true
    ),
    true
  );
  assert.equal(
    isCardVisualStale(spec, { [key]: { hash, generatedAt: '2026-05-08T00:00:00.000Z' } }, false),
    true
  );
});
