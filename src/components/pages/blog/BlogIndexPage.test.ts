import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const projectRoot = path.resolve(import.meta.dirname, '../../../..');

function readProjectFile(relativePath: string) {
  return readFileSync(path.join(projectRoot, relativePath), 'utf8');
}

test('listing pages use the shared editorial hero path instead of divergent hero components', () => {
  const blogPage = readProjectFile('src/pages/blog/index.astro');
  const projectsPage = readProjectFile('src/pages/projects.astro');
  const publicationsPage = readProjectFile('src/pages/publications.astro');
  const talksPage = readProjectFile('src/pages/talks.astro');

  for (const page of [blogPage, projectsPage, publicationsPage, talksPage]) {
    assert.match(
      page,
      /import\s+EditorialPageHero\s+from\s+['"]@\/components\/layout\/core\/EditorialPageHero\.astro['"]/
    );
  }

  assert.doesNotMatch(blogPage, /BlogIndexHero/);
  assert.doesNotMatch(projectsPage, /PageWithHero/);
  assert.doesNotMatch(publicationsPage, /PageWithHero/);
  assert.doesNotMatch(talksPage, /PageWithHero/);
});

test('blog index opts into editorial tones for the toolbar and cards', () => {
  const page = readProjectFile('src/components/layout/BlogListPage.tsx');

  assert.match(page, /tone="editorial"/);
});

test('blog index uses the blog editorial hero variant', () => {
  const page = readProjectFile('src/pages/blog/index.astro');
  const editorialHero = readProjectFile('src/components/layout/core/EditorialPageHero.astro');

  assert.match(editorialHero, /variant\?:\s*'default'\s*\|\s*'blog'/);
  assert.match(page, /<EditorialPageHero[\s\S]*variant="blog"/);
});

test('blog editorial hero keeps observatory star motion subtle and accessible', () => {
  const editorialHero = readProjectFile('src/components/layout/core/EditorialPageHero.astro');
  const tokens = readProjectFile('src/styles/tokens.css');

  assert.match(editorialHero, /blogHeroStars/);
  assert.match(editorialHero, /editorial-page-hero__star/);
  assert.match(editorialHero, /blog-hero-star-enter/);
  assert.match(editorialHero, /blog-hero-star-drift/);
  assert.match(
    editorialHero,
    /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*\.editorial-page-hero__star/
  );
  assert.match(tokens, /--blog-hero-star:/);
  assert.match(tokens, /--blog-hero-star-shadow:/);
});

test('blog index renders a filtered featured lead before the remaining grid', () => {
  const page = readProjectFile('src/components/layout/BlogListPage.tsx');

  assert.match(page, /const featuredPost\s*=\s*sorted\[0\]/);
  assert.match(page, /const gridPosts\s*=\s*sorted\.slice\(1\)/);
  assert.match(page, /presentation="featured"/);
  assert.match(page, /gridPosts\.map/);
  assert.match(page, /blog-index__featured/);
  assert.match(page, /blog-index__grid/);
});

test('blog index surfaces use token-backed editorial classes', () => {
  const tokens = readProjectFile('src/styles/tokens.css');
  const filterPanel = readProjectFile('src/components/ui/filter/FilterPanel.tsx');
  const searchInput = readProjectFile('src/components/ui/interaction/SearchInput.tsx');
  const languageSwitcher = readProjectFile('src/components/ui/blog/BlogLanguageSwitcher.tsx');

  assert.match(tokens, /--listing-toolbar-surface:/);
  assert.match(tokens, /--listing-control-surface:/);
  assert.match(tokens, /--blog-index-featured-min-height:/);
  assert.match(tokens, /--blog-index-grid-gap:/);

  assert.match(filterPanel, /editorial-filter-panel/);
  assert.doesNotMatch(filterPanel, /blog-filter-panel--editorial[^']*bg-\[/);
  assert.match(searchInput, /search-input--editorial/);
  assert.doesNotMatch(searchInput, /tone === 'editorial'[\s\S]{0,120}bg-\[/);
  assert.match(languageSwitcher, /language-switcher--editorial/);
});

test('blog index avoids client-only locale reads during initial render', () => {
  const page = readProjectFile('src/components/layout/BlogListPage.tsx');

  assert.match(page, /useState<BlogTranslationLocale>\(initialLocale\)/);
  assert.doesNotMatch(page, /useState<BlogTranslationLocale>\(\(\)\s*=>[\s\S]*typeof window/);
});

test('interactive blog language switcher keeps a stable element shape for hydration', () => {
  const languageSwitcher = readProjectFile('src/components/ui/blog/BlogLanguageSwitcher.tsx');

  assert.match(languageSwitcher, /if\s*\(onSelect\)\s*\{[\s\S]*<button/);
  assert.match(languageSwitcher, /aria-current=\{option\.isActive \? 'true' : undefined\}/);
  assert.match(languageSwitcher, /if\s*\(option\.isActive\)\s*\{[\s\S]*<span/);
});

test('listing explorers use the shared editorial explorer abstraction', () => {
  const projectsExplorer = readProjectFile('src/components/explorers/ProjectsExplorer.tsx');
  const publicationsExplorer = readProjectFile('src/components/explorers/PublicationsExplorer.tsx');
  const talksExplorer = readProjectFile('src/components/explorers/TalksExplorer.tsx');
  const oldExplorerPath = path.join(projectRoot, 'src/components/explorers/DataExplorer.tsx');

  for (const explorer of [projectsExplorer, publicationsExplorer, talksExplorer]) {
    assert.match(
      explorer,
      /import\s+\{\s*EditorialExplorer\s*\}\s+from\s+['"]\.\/EditorialExplorer['"]/
    );
    assert.doesNotMatch(explorer, /DataExplorer/);
  }

  assert.equal(existsSync(oldExplorerPath), false);
});

test('editorial listing surface components expose the shared configuration hooks', () => {
  const filterPanel = readProjectFile('src/components/ui/filter/FilterPanel.tsx');
  const languageSwitcher = readProjectFile('src/components/ui/blog/BlogLanguageSwitcher.tsx');
  const blogCard = readProjectFile('src/components/ui/cards/BlogCard.tsx');
  const editorialExplorer = readProjectFile('src/components/explorers/EditorialExplorer.tsx');
  const editorialHero = readProjectFile('src/components/layout/core/EditorialPageHero.astro');

  assert.match(filterPanel, /tone\?:\s*'default'\s*\|\s*'editorial'/);
  assert.match(languageSwitcher, /tone\?:\s*'default'\s*\|\s*'editorial'/);
  assert.match(blogCard, /tone\?:\s*'default'\s*\|\s*'editorial'/);
  assert.match(editorialExplorer, /toolbarAccessory\?:\s*ReactNode/);
  assert.match(editorialExplorer, /footer\?:\s*ReactNode/);
  assert.match(editorialHero, /eyebrow\?:\s*string/);
  assert.match(editorialHero, /<slot\s+name="support"/);
});

test('listing surfaces render complete filtered collections without pagination controls', () => {
  const blogListPage = readProjectFile('src/components/layout/BlogListPage.tsx');
  const editorialExplorer = readProjectFile('src/components/explorers/EditorialExplorer.tsx');
  const editorialShell = readProjectFile('src/components/explorers/EditorialListingShell.tsx');

  for (const file of [blogListPage, editorialExplorer, editorialShell]) {
    assert.doesNotMatch(file, /usePagination/);
    assert.doesNotMatch(file, /PageControls/);
  }

  assert.match(blogListPage, /gridPosts\.map/);
  assert.doesNotMatch(blogListPage, /pagePosts/);
  assert.match(editorialExplorer, /sorted\.map/);
  assert.doesNotMatch(editorialExplorer, /paged/);
  assert.doesNotMatch(editorialShell, /pagination/);
});

test('listing animations never hide primary content while waiting for reveal JavaScript', () => {
  const blogListPage = readProjectFile('src/components/layout/BlogListPage.tsx');
  const editorialExplorer = readProjectFile('src/components/explorers/EditorialExplorer.tsx');
  const interactionExports = readProjectFile('src/components/ui/interaction/index.ts');
  const globalStyles = readProjectFile('src/styles/global.css');

  for (const file of [blogListPage, editorialExplorer]) {
    assert.doesNotMatch(file, /<Reveal/);
    assert.doesNotMatch(file, /className="[^"]*\breveal\b/);
  }

  assert.doesNotMatch(interactionExports, /Reveal/);
  assert.doesNotMatch(globalStyles, /\.reveal\s*\{[^}]*opacity:\s*0\s*;/s);
  assert.doesNotMatch(globalStyles, /\.section-reveal\s*\{[^}]*opacity:\s*0\s*;/s);
  assert.match(globalStyles, /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*\.reveal/);
  assert.match(
    globalStyles,
    /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*opacity:\s*1\s*!important/
  );
  assert.match(
    globalStyles,
    /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*transform:\s*none\s*!important/
  );
});
