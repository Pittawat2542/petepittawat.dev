import assert from 'node:assert/strict';
import test from 'node:test';

import { buildTocItems, getActiveHeadingId, slugifyHeading } from './toc.ts';

test('slugifyHeading normalizes prose headings into anchor-safe ids', () => {
  assert.equal(
    slugifyHeading('Replacement, Survival, and the Quiet Psychological War at Work'),
    'replacement-survival-and-the-quiet-psychological-war-at-work'
  );
  assert.equal(slugifyHeading('  References  '), 'references');
});

test('buildTocItems preserves existing ids and generates stable unique ids for duplicates', () => {
  const items = buildTocItems([
    { id: '', text: 'Introduction', level: 2 },
    { id: '', text: 'Introduction', level: 2 },
    { id: 'references', text: 'References', level: 2 },
    { id: '', text: 'References', level: 3 },
  ]);

  assert.deepEqual(
    items.map(item => ({ id: item.id, text: item.text, level: item.level, depth: item.depth })),
    [
      { id: 'introduction', text: 'Introduction', level: 2, depth: 'main' },
      { id: 'introduction-2', text: 'Introduction', level: 2, depth: 'main' },
      { id: 'references', text: 'References', level: 2, depth: 'main' },
      { id: 'references-2', text: 'References', level: 3, depth: 'sub' },
    ]
  );
});

test('getActiveHeadingId keeps the reader anchored to the last heading that crossed the offset line', () => {
  const activeId = getActiveHeadingId(
    [
      { id: 'introduction', top: -120 },
      { id: 'section-1', top: 32 },
      { id: 'section-2', top: 280 },
    ],
    72
  );

  assert.equal(activeId, 'section-1');
});

test('getActiveHeadingId falls back to the first heading when no section has crossed the offset', () => {
  const activeId = getActiveHeadingId(
    [
      { id: 'introduction', top: 96 },
      { id: 'section-1', top: 240 },
    ],
    72
  );

  assert.equal(activeId, 'introduction');
});
