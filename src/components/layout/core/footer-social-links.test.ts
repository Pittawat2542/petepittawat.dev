import assert from 'node:assert/strict';
import test from 'node:test';

import { socialLinks } from './footer-social-links.ts';

test('every footer social link has an explicit brand icon source', () => {
  assert.ok(socialLinks.length > 0);

  for (const link of socialLinks) {
    assert.ok(link.brandIcon ?? link.customIcon, `${link.label} is missing an icon configuration`);
  }
});

test('footer brands use the expected icon sources', () => {
  const expected = new Map([
    ['GitHub', 'brand'],
    ['LinkedIn', 'linkedin'],
    ['Instagram', 'brand'],
    ['Google Scholar', 'brand'],
    ['ORCID', 'brand'],
  ]);

  for (const link of socialLinks) {
    const actual = link.brandIcon ? 'brand' : (link.customIcon ?? 'missing');
    assert.equal(
      actual,
      expected.get(link.label),
      `${link.label} icon source changed unexpectedly`
    );
  }
});
