import assert from 'node:assert/strict';
import test from 'node:test';

import { getSiteCopy } from './copy.ts';

test('returns the canonical English site copy for the default locale', () => {
  const copy = getSiteCopy('en');

  assert.equal(copy.nav.links.find(link => link.key === 'about')?.label, 'About');
  assert.equal(copy.listingPages.projects.path, '/projects');
  assert.equal(copy.home.hero.primaryCtas[0]?.href, '/projects');
});

test('falls back to English copy for untranslated Thai non-blog content', () => {
  const englishCopy = getSiteCopy('en');
  const thaiCopy = getSiteCopy('th');

  assert.deepEqual(thaiCopy.meta, englishCopy.meta);
  assert.equal(thaiCopy.home.hero.title, englishCopy.home.hero.title);
  assert.equal(thaiCopy.footer.summary, englishCopy.footer.summary);
});
