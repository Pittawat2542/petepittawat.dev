import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const projectRoot = path.resolve(import.meta.dirname, '../../../..');

function readProjectFile(relativePath: string) {
  return readFileSync(path.join(projectRoot, relativePath), 'utf8');
}

test('about page is rebuilt around the reference-inspired research profile structure', () => {
  const page = readProjectFile('src/components/pages/AboutPage.astro');

  assert.match(
    page,
    /import\s+AboutHero\s+from\s+['"]@\/components\/pages\/about\/AboutHero\.astro['"]/
  );
  assert.match(
    page,
    /import\s+PageBackdrop\s+from\s+['"]@\/components\/layout\/core\/PageBackdrop\.astro['"]/
  );
  assert.match(page, /<AboutHero\s+aboutCopy=\{aboutCopy\}/);
  assert.match(page, /<PageBackdrop\s+variant="landing"\s*\/>/);
  assert.match(page, /AboutProofPoints/);
  assert.match(page, /AboutCurrentWork/);
  assert.match(page, /AboutMilestones/);
  assert.doesNotMatch(page, /EditorialPageHero/);
  assert.doesNotMatch(page, /ThemedPageHero/);
  assert.doesNotMatch(page, /AboutIntro/);
  assert.doesNotMatch(page, /AboutSnapshot/);
  assert.doesNotMatch(page, /AboutJourney/);
});

test('about hero reuses the shared social link source instead of hardcoded profile links', () => {
  const hero = readProjectFile('src/components/pages/about/AboutHero.astro');

  assert.match(
    hero,
    /import\s+\{\s*socialLinks\s*\}\s+from\s+['"]@\/components\/layout\/core\/footer-social-links['"]/
  );
  assert.match(hero, /about-hero__constellation/);
  assert.match(hero, /\{aboutCopy\.intro\.title\}/);
  assert.match(hero, /about-hero__profile-main/);
  assert.match(hero, /about-hero__profile-note/);
  assert.match(hero, /about-hero__social-icon/);
  assert.doesNotMatch(hero, /https:\/\/www\.linkedin\.com\/in\/pittawat-tav\//);
  assert.doesNotMatch(hero, /https:\/\/github\.com\/Pittawat2542/);
  assert.doesNotMatch(hero, /https:\/\/scholar\.google\.co\.jp/);
});

test('about sections expose icon-led cards and visual timeline hooks', () => {
  const proofPoints = readProjectFile('src/components/pages/about/AboutProofPoints.astro');
  const themes = readProjectFile('src/components/pages/about/AboutThemes.astro');
  const currentWork = readProjectFile('src/components/pages/about/AboutCurrentWork.astro');
  const background = readProjectFile('src/components/pages/about/AboutBackground.astro');
  const milestones = readProjectFile('src/components/pages/about/AboutMilestones.astro');

  assert.match(proofPoints, /proof-card__icon/);
  assert.match(themes, /theme-card__icon/);
  assert.match(currentWork, /current-work-visual/);
  assert.match(background, /background-principles/);
  assert.match(milestones, /milestone-timeline/);
});
