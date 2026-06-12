import assert from 'node:assert/strict';
import test from 'node:test';

import { siteCopyEn } from '../data/site/copy.ts';
import { buildPageSearchItems } from './search-page-items.ts';

test('page search metadata includes the research map', () => {
  const items = buildPageSearchItems(siteCopyEn);
  const research = items.find(item => item.id === 'page:research');

  assert.equal(research?.title, 'Research');
  assert.equal(research?.localizedUrl, '/research');
  assert.equal(research?.description, siteCopyEn.listingPages.research.searchDescription);
});

test('research page appears before publications in page search metadata', () => {
  const itemIds = buildPageSearchItems(siteCopyEn).map(item => item.id);

  assert.ok(
    itemIds.indexOf('page:research') < itemIds.indexOf('page:publications'),
    'Research should be listed before Publications'
  );
});
