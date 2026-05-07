import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const projectRoot = path.resolve(import.meta.dirname, '../../../..');

function readProjectFile(relativePath: string) {
  return readFileSync(path.join(projectRoot, relativePath), 'utf8');
}

test('about page is rebuilt around the audience-first editorial structure', () => {
  const page = readProjectFile('src/components/pages/AboutPage.astro');

  assert.match(
    page,
    /import\s+EditorialPageHero\s+from\s+['"]@\/components\/layout\/core\/EditorialPageHero\.astro['"]/
  );
  assert.match(page, /AboutProofPoints/);
  assert.match(page, /AboutCurrentWork/);
  assert.match(page, /AboutMilestones/);
  assert.doesNotMatch(page, /ThemedPageHero/);
  assert.doesNotMatch(page, /AboutSnapshot/);
  assert.doesNotMatch(page, /AboutJourney/);
});

test('about intro reuses the shared social link source instead of hardcoded profile links', () => {
  const intro = readProjectFile('src/components/pages/about/AboutIntro.astro');

  assert.match(
    intro,
    /import\s+\{\s*socialLinks\s*\}\s+from\s+['"]@\/components\/layout\/core\/footer-social-links['"]/
  );
  assert.doesNotMatch(intro, /https:\/\/www\.linkedin\.com\/in\/pittawat-tav\//);
  assert.doesNotMatch(intro, /https:\/\/github\.com\/Pittawat2542/);
  assert.doesNotMatch(intro, /https:\/\/scholar\.google\.co\.jp/);
});
