import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const projectRoot = path.resolve(import.meta.dirname, '../../../..');

function readProjectFile(relativePath: string) {
  return readFileSync(path.join(projectRoot, relativePath), 'utf8');
}

test('shared page layout uses a single global accent instead of page-specific accent variables', () => {
  const baseLayout = readProjectFile('src/layouts/BaseLayout.astro');
  const themedHero = readProjectFile('src/components/layout/core/ThemedPageHero.astro');

  assert.doesNotMatch(baseLayout, /accent-\$\{pageKey\}/);
  assert.doesNotMatch(themedHero, /accent-\$\{page\}/);
  assert.match(baseLayout, /var\(--accent,\s*#6ac1ff\)/);
  assert.match(themedHero, /var\(--accent,\s*#6ac1ff\)/);
});

test('non-blog listing cards derive accents from the single site accent', () => {
  const projectCard = readProjectFile('src/components/ui/cards/ProjectCard.tsx');
  const talkCard = readProjectFile('src/components/ui/cards/TalkCard.tsx');
  const publicationUtils = readProjectFile('src/components/ui/publication/utils.ts');

  assert.match(projectCard, /return 'var\(--accent\)'/);
  assert.match(talkCard, /getAccentColorVar\('accent'\)/);
  assert.doesNotMatch(
    publicationUtils,
    /accent-publications|accent-talks|accent-projects|accent-about|accent-2|accent-research/
  );
  assert.match(publicationUtils, /return 'var\(--accent\)'/);
});

test('shared theme tokens retire legacy purple accents in favor of blue-led and warm complementary values', () => {
  const globalCss = readProjectFile('src/styles/global.css');

  assert.doesNotMatch(globalCss, /#8b5cf6|rgba\(139,\s*92,\s*246|#7469b6/);
  assert.doesNotMatch(globalCss, /\.hero-text-gradient-purple/);
  assert.match(globalCss, /--accent:\s*#60a5fa/);
  assert.match(globalCss, /--accent-talks:\s*#f97316/);
  assert.match(globalCss, /--accent-2:\s*#fb923c/);
});
