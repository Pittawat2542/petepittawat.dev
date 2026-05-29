import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const projectRoot = path.resolve(import.meta.dirname, '../../../..');

function readProjectFile(relativePath: string) {
  return readFileSync(path.join(projectRoot, relativePath), 'utf8');
}

function readEditorialListingStyles() {
  return [
    'src/styles/components/editorial-listing.layout.css',
    'src/styles/components/editorial-filter-panel.css',
    'src/styles/components/editorial-tag-controls.css',
    'src/styles/components/editorial-toolbar-controls.css',
    'src/styles/components/editorial-language-switcher.css',
    'src/styles/components/editorial-filter-chips.css',
    'src/styles/components/editorial-card-layout.css',
  ]
    .map(readProjectFile)
    .join('\n');
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
  const filterPanelBody = readProjectFile('src/components/ui/filter/FilterPanelBody.tsx');
  const dropdownFilters = readProjectFile('src/components/ui/filter/DropdownFilters.tsx');
  const tagFilters = readProjectFile('src/components/ui/filter/TagFilters.tsx');
  const searchInput = readProjectFile('src/components/ui/interaction/SearchInput.tsx');
  const languageSwitcher = readProjectFile('src/components/ui/blog/BlogLanguageSwitcher.tsx');

  assert.match(tokens, /--listing-toolbar-surface:/);
  assert.match(tokens, /--listing-control-surface:/);
  assert.match(tokens, /--filter-pane-surface:/);
  assert.match(tokens, /--filter-pane-divider:/);
  assert.match(tokens, /--filter-chip-selected-primary-surface:/);
  assert.match(tokens, /--blog-index-featured-min-height:/);
  assert.match(tokens, /--blog-index-grid-gap:/);

  assert.match(filterPanel, /editorial-filter-panel/);
  assert.match(filterPanelBody, /editorial-filter-panel__filters/);
  assert.match(dropdownFilters, /editorial-filter-group/);
  assert.match(tagFilters, /editorial-filter-group--tags/);
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

  assert.match(languageSwitcher, /const shortOptionLabel = option\.shortLabel \?\? option\.label/);
  assert.match(languageSwitcher, /\{option\.label\}/);
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
  assert.match(editorialExplorer, /tagField\?:/);
  assert.match(editorialExplorer, /renderFeaturedItem\?:/);
  assert.match(editorialExplorer, /featuredLabel\?:\s*string/);
  assert.match(editorialExplorer, /gridLabel\?:\s*string/);
  assert.match(editorialExplorer, /emptyTitle\?:\s*string/);
  assert.match(editorialExplorer, /emptyCopy\?:\s*string/);
  assert.match(editorialHero, /eyebrow\?:\s*string/);
  assert.match(editorialHero, /<slot\s+name="support"/);
});

test('non-blog listing explorers use tag chips and featured editorial sections', () => {
  const projectsExplorer = readProjectFile('src/components/explorers/ProjectsExplorer.tsx');
  const publicationsExplorer = readProjectFile('src/components/explorers/PublicationsExplorer.tsx');
  const talksExplorer = readProjectFile('src/components/explorers/TalksExplorer.tsx');
  const editorialExplorer = readProjectFile('src/components/explorers/EditorialExplorer.tsx');
  const tagFilters = readProjectFile('src/components/ui/filter/TagFilters.tsx');
  const editorialListingStyles = readEditorialListingStyles();

  for (const explorer of [projectsExplorer, publicationsExplorer, talksExplorer]) {
    assert.match(explorer, /tagField=\{item\s*=>\s*item\.tags\}/);
    assert.doesNotMatch(explorer, /filterFields=\{\{[\s\S]*tag:\s*item\s*=>\s*item\.tags/);
    assert.match(explorer, /renderFeaturedItem=\{item\s*=>/);
    assert.match(explorer, /featuredLabel=/);
    assert.match(explorer, /gridLabel=/);
    assert.match(explorer, /emptyTitle=/);
    assert.match(explorer, /emptyCopy=/);
  }

  assert.match(editorialExplorer, /const featuredItem\s*=\s*sorted\[0\]/);
  assert.match(
    editorialExplorer,
    /const gridItems\s*=\s*renderFeaturedItem \? sorted\.slice\(1\) : sorted/
  );
  assert.match(editorialExplorer, /editorial-listing__featured/);
  assert.match(editorialExplorer, /editorial-listing__grid/);
  assert.match(editorialExplorer, /availableTags=\{tagOptions\}/);
  assert.match(editorialListingStyles, /\.editorial-listing__items/);
  assert.match(editorialListingStyles, /\.editorial-listing__featured/);
  assert.match(editorialListingStyles, /\.editorial-listing__grid/);
  assert.match(editorialListingStyles, /\.editorial-listing__empty/);
  assert.match(tagFilters, /DropdownMenuCheckboxItem/);
  assert.match(tagFilters, /placeholder="Search tags"/);
  assert.match(tagFilters, /selectedTagList/);
  assert.match(tagFilters, /editorial-tag-combobox/);
  assert.doesNotMatch(tagFilters, /availableTags\.map\(tag =>[\s\S]*<FilterChip/);
  assert.match(editorialListingStyles, /\.editorial-tag-combobox/);
  assert.match(editorialListingStyles, /\.editorial-selected-tags/);
});

test('showcase listing pages use hero support chips and preserve single accent policy', () => {
  const projectsPage = readProjectFile('src/pages/projects.astro');
  const publicationsPage = readProjectFile('src/pages/publications.astro');
  const talksPage = readProjectFile('src/pages/talks.astro');
  const editorialHero = readProjectFile('src/components/layout/core/EditorialPageHero.astro');

  assert.match(editorialHero, /variant\?:\s*'default'\s*\|\s*'blog'\s*\|\s*'showcase'/);

  for (const page of [projectsPage, publicationsPage, talksPage]) {
    assert.match(page, /variant="showcase"/);
    assert.match(page, /slot="support"/);
    assert.match(page, /listing-hero-support/);
    assert.doesNotMatch(page, /accent-projects|accent-publications|accent-talks/);
  }
});

test('talk cards accept the shared featured card contract', () => {
  const talkCard = readProjectFile('src/components/ui/cards/TalkCard.tsx');

  assert.match(talkCard, /readonly featured\?:\s*boolean/);
  assert.match(talkCard, /\{\s*item,\s*featured\s*=\s*false\s*\}/);
  assert.match(talkCard, /featured=\{featured\}/);
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
  assert.match(editorialExplorer, /gridItems\.map/);
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
