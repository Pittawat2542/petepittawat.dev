import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
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
  assert.match(baseLayout, /var\(--accent,\s*var\(--color-accent-primary\)\)/);
  assert.match(themedHero, /var\(--accent,\s*var\(--color-accent-primary\)\)/);
  assert.doesNotMatch(baseLayout, /background:#080d19;color:#F6F8FC/);
});

test('shared page layout renders a keyboard skip link to the main content landmark', () => {
  const baseLayout = readProjectFile('src/layouts/BaseLayout.astro');

  assert.match(baseLayout, /href="#main-content"/);
  assert.match(baseLayout, /class="skip-link"/);
  assert.match(baseLayout, /<main[^>]*id="main-content"[^>]*tabindex="-1"/s);
});

test('shared layout loads reveal behavior through an explicit opt-in controller', () => {
  const baseLayout = readProjectFile('src/layouts/BaseLayout.astro');
  assert.equal(
    existsSync(path.join(projectRoot, 'src/components/common/RevealController.astro')),
    true
  );
  assert.equal(existsSync(path.join(projectRoot, 'src/scripts/reveal.ts')), true);
  const revealController = readProjectFile('src/components/common/RevealController.astro');
  const revealScript = readProjectFile('src/scripts/reveal.ts');

  assert.match(
    baseLayout,
    /import RevealController from '@\/components\/common\/RevealController\.astro'/
  );
  assert.match(baseLayout, /<RevealController \/>/);
  assert.doesNotMatch(baseLayout, /new MutationObserver/);
  assert.doesNotMatch(baseLayout, /new IntersectionObserver/);
  assert.match(revealController, /import '@\/scripts\/reveal'/);
  assert.match(revealScript, /IntersectionObserver/);
  assert.doesNotMatch(revealScript, /MutationObserver/);
});

test('themed page hero uses normal stylesheet ownership instead of injected CSS strings', () => {
  const themedHero = readProjectFile('src/components/layout/core/ThemedPageHero.astro');
  assert.equal(
    existsSync(path.join(projectRoot, 'src/styles/components/themed-page-hero.css')),
    true
  );
  const themedHeroStyles = readProjectFile('src/styles/components/themed-page-hero.css');

  assert.match(themedHero, /@\/styles\/components\/themed-page-hero\.css/);
  assert.doesNotMatch(themedHero, /THEMED_PAGE_HERO_STYLES/);
  assert.doesNotMatch(themedHero, /set:html/);
  assert.match(themedHeroStyles, /\.themed-hero/);
});

test('site metadata has one runtime source of truth', () => {
  const constants = readProjectFile('src/lib/constants.ts');
  const blogPostLayout = readProjectFile('src/layouts/BlogPost.astro');

  assert.match(constants, /url:\s*'https:\/\/petepittawat\.dev'/);
  assert.match(constants, /title:\s*'PETEPITTAWAT\.DEV'/);
  assert.match(constants, /description:/);
  assert.match(constants, /author:\s*'Pittawat Taveekitworachai'/);
  assert.match(blogPostLayout, /import \{ SITE_TITLE \} from '@\/consts'/);
  assert.match(blogPostLayout, /title=\{`\$\{title\} - \$\{SITE_TITLE\}`\}/);
  assert.doesNotMatch(blogPostLayout, /PETEPITTAWAT\.DEV/);
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
  const tokensCss = readProjectFile('src/styles/tokens.css');

  assert.doesNotMatch(globalCss, /#8b5cf6|rgba\(139,\s*92,\s*246|#7469b6/);
  assert.doesNotMatch(globalCss, /\.hero-text-gradient-purple/);
  assert.match(tokensCss, /--accent:\s*#60a5fa/);
  assert.match(tokensCss, /--accent-talks:\s*#f97316/);
  assert.match(tokensCss, /--accent-2:\s*#fb923c/);
});
