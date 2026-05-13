import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';

import { socialLinks } from './footer-social-links.ts';

const projectRoot = path.resolve(import.meta.dirname, '../../../..');

function readProjectFile(relativePath: string) {
  return readFileSync(path.join(projectRoot, relativePath), 'utf8');
}

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

test('footer chrome uses the shared logo and external social source only', () => {
  const footer = readProjectFile('src/components/layout/core/Footer.astro');

  assert.match(footer, /import\s+SiteLogo\s+from\s+['"]@\/components\/header\/SiteLogo\.astro['"]/);
  assert.match(footer, /<SiteLogo[\s>]/);
  assert.match(footer, /socialLinks\.map/);
  assert.match(footer, /site-footer__social-link/);
  assert.match(footer, /site-footer__social-label/);
  assert.match(footer, /site-footer__social-external/);
  assert.doesNotMatch(footer, /quickLinks/);
  assert.doesNotMatch(footer, /site-footer__links/);
  assert.doesNotMatch(footer, /BookOpenText|FolderKanban|FileText|Mic|CircleUser/);
});
