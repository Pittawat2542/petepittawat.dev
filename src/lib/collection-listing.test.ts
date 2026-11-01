import assert from 'node:assert/strict';
import test from 'node:test';
import { buildCollectionListing } from './collection-listing.ts';

test('collection metadata preserves IDs, search fields, and newest-first ordering', () => {
  const entries = buildCollectionListing({
    kind: 'projects',
    items: [
      { title: 'Earlier project', year: 2024, summary: 'Old', tags: [], links: [] },
      {
        title: 'New project',
        year: 2026,
        summary: 'Research',
        role: 'Engineer',
        collaborators: 'Team',
        tags: ['AI'],
        links: [],
      },
    ],
  });
  assert.deepEqual(
    entries.map(entry => entry.meta.id),
    ['project-new-project-2026', 'project-earlier-project-2024']
  );
  assert.equal(entries[0]?.meta.search, 'new project research team engineer');
  assert.deepEqual(entries[0]?.meta.fields, { year: '2026', type: 'other' });
  assert.equal(entries[0]?.kind, 'projects');
});

test('publication and talk metadata use their collection-specific fields', () => {
  const [publication] = buildCollectionListing({
    kind: 'publications',
    items: [
      {
        title: 'Paper',
        year: 2025,
        authors: 'Author',
        venue: 'Conference',
        type: 'research',
        url: null,
        artifacts: [],
        tags: ['AI'],
      },
    ],
  });
  assert.equal(publication?.meta.id, 'publication-paper-2025');
  assert.equal(publication?.meta.search, 'paper conference author');
  const [talk] = buildCollectionListing({
    kind: 'talks',
    items: [
      {
        title: 'Talk',
        date: new Date('2026-02-01T00:00:00Z'),
        mode: 'Online',
        audience: 'Developers',
        audienceUrl: null,
        resources: [],
        tags: [],
      },
    ],
  });
  assert.equal(talk?.meta.id, 'talk-talk-2026');
  assert.equal(talk?.meta.search, 'talk developers online');
  assert.deepEqual(talk?.meta.fields, { year: '2026', mode: 'Online', audience: 'Developers' });
});
