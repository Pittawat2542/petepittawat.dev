import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const projectRoot = path.resolve(import.meta.dirname, '../../..');

function readProjectFile(relativePath: string) {
  return readFileSync(path.join(projectRoot, relativePath), 'utf8');
}

test('homepage routes output stats into the hero instead of a standalone selected output section', () => {
  const page = readProjectFile('src/pages/index.astro');
  const researchIndex = page.indexOf('<ResearchInPracticeSection');
  const heroIndex = page.indexOf('<HeroSection');

  assert.match(page, /selectedOutputStats/);
  assert.match(page, /selectedOutputStats={selectedOutputStats}/);
  assert.match(page, /selectedOutput={siteCopy\.home\.selectedOutput}/);
  assert.equal(page.includes('SelectedOutputSection'), false);
  assert.equal(page.includes('StatsSection'), false);
  assert.ok(heroIndex > -1);
  assert.ok(researchIndex > -1);
  assert.ok(heroIndex < researchIndex);
});

test('hero owns the single output call-to-action gateway', () => {
  const hero = readProjectFile('src/components/sections/HeroSection.astro');

  assert.match(hero, /HeroCtaGrid/);
  assert.match(hero, /selectedOutputStats/);
  assert.match(hero, /copy={selectedOutput}/);
  assert.equal(
    existsSync(path.join(projectRoot, 'src/components/sections/HeroCtaGrid.astro')),
    true
  );
  assert.equal(
    existsSync(path.join(projectRoot, 'src/components/sections/hero/HeroCtaCard.astro')),
    true
  );
});

test('hero CTA cards preserve the original visual base while adding selected output metrics', () => {
  const grid = readProjectFile('src/components/sections/HeroCtaGrid.astro');
  const card = readProjectFile('src/components/sections/hero/HeroCtaCard.astro');
  const tokens = readProjectFile('src/styles/tokens.css');

  assert.match(grid, /copy:\s*SiteCopy\['home'\]\['selectedOutput'\]/);
  assert.match(grid, /stats:\s*HeroCtaStats/);
  assert.match(grid, /count:\s*stats\[config\.key\]/);
  assert.match(grid, /formatCtaLabel/);
  assert.match(grid, /\.replace\('\{count\}'/);
  assert.match(grid, /toLocaleString\('en-US'\)/);
  assert.doesNotMatch(card, /hero-cta-card__metric/);
  assert.match(card, /hero-cta-card__header/);
  assert.match(card, /grid-template-columns:\s*minmax\(0,\s*1fr\)/);
  assert.match(card, /grid-template-rows:\s*auto minmax\(0,\s*1fr\) auto auto/);
  assert.match(
    card,
    /\.hero-cta-card__header,\n\s*\.hero-cta-card__description,\n\s*\.hero-cta-card__divider,\n\s*\.hero-cta-card__link \{\n\s*grid-column: 1 \/ -1/
  );
  assert.match(card, /width:\s*clamp\(2\.28rem,\s*3vw,\s*2\.5rem\)/);
  assert.match(card, /border-radius:\s*0\.86rem/);
  assert.doesNotMatch(card, /hero-cta-card__icon-shell shape-squircle-sm/);
  assert.match(card, /var\(--output-card-bg\)/);
  assert.equal(
    existsSync(path.join(projectRoot, 'src/components/sections/SelectedOutputSection.astro')),
    false
  );
  assert.match(tokens, /--output-card-bg:/);
  assert.match(tokens, /--output-card-hover-border:/);
  assert.match(tokens, /--output-card-focus-ring:/);
});

test('hero output blog count comes from preferred posts instead of locale division', () => {
  const page = readProjectFile('src/pages/index.astro');
  const grid = readProjectFile('src/components/sections/HeroCtaGrid.astro');

  assert.match(page, /preferredPosts\.length/);
  assert.doesNotMatch(grid, /\/\s*2/);
});

test('homepage latest writing uses an editorial featured essay layout', () => {
  const page = readProjectFile('src/pages/index.astro');
  const blogSection = readProjectFile('src/components/sections/BlogSection.astro');
  const blogCard = readProjectFile('src/components/ui/cards/BlogCard.tsx');
  const blogMeta = readProjectFile('src/components/ui/blog/BlogCardMeta.tsx');

  assert.match(page, /preferredPosts\.slice\(0,\s*3\)/);
  assert.match(blogSection, /import\s+\{\s*estimateReadingMetrics\s*\}/);
  assert.match(blogSection, /const featuredPost = posts\[0\]/);
  assert.match(blogSection, /const compactPosts = posts\.slice\(1,\s*3\)/);
  assert.match(blogSection, /presentation="featured"/);
  assert.match(blogSection, /presentation="compact"/);
  assert.match(blogSection, /readingTimeMin={getReadingTimeMin\(featuredPost\)}/);
  assert.match(blogSection, /readingTimeMin={getReadingTimeMin\(post\)}/);
  assert.match(blogCard, /presentation\?:\s*'standard'\s*\|\s*'featured'\s*\|\s*'compact'/);
  assert.match(blogCard, /Read essay/);
  assert.match(blogMeta, /readingTimeMin\?:\s*number/);
  assert.match(blogMeta, /\{readingTimeMin\} min read/);
});
