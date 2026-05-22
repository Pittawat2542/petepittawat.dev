import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const projectRoot = path.resolve(import.meta.dirname, '../..');

function readProjectFile(relativePath: string) {
  return readFileSync(path.join(projectRoot, relativePath), 'utf8');
}

test('global stylesheet does not own component-specific visual systems', () => {
  const globalCss = readProjectFile('src/styles/global.css');

  assert.doesNotMatch(globalCss, /^\.media-card\b/m);
  assert.doesNotMatch(globalCss, /^\.editorial-listing__/m);
  assert.doesNotMatch(globalCss, /^\.editorial-filter-/m);
  assert.doesNotMatch(globalCss, /^\.blog-cover-root\b/m);
  assert.doesNotMatch(globalCss, /^\.prose\s+\.callout\b/m);
});

test('component-owned global classes are imported by their rendering owners', () => {
  const mediaContentCard = readProjectFile('src/components/ui/cards/MediaContentCard.tsx');
  const editorialListingShell = readProjectFile(
    'src/components/explorers/EditorialListingShell.tsx'
  );
  const blogCover = readProjectFile('src/components/ui/blog/BlogCover.tsx');
  const articleBody = readProjectFile('src/components/layout/blog-post/ArticleBody.astro');
  const searchDialogContent = readProjectFile('src/components/search/SearchDialogContent.tsx');
  const searchResultList = readProjectFile('src/components/search/SearchResultList.tsx');
  const searchInput = readProjectFile('src/components/ui/interaction/SearchInput.tsx');

  assert.match(mediaContentCard, /@\/styles\/components\/media-card\.css/);
  assert.match(editorialListingShell, /@\/styles\/components\/editorial-listing\.css/);
  assert.match(blogCover, /@\/styles\/components\/blog-cover\.css/);
  assert.match(articleBody, /@\/styles\/components\/prose\.css/);
  assert.match(searchDialogContent, /@\/styles\/components\/search-modal\.css/);
  assert.match(searchResultList, /@\/styles\/components\/search-results\.css/);
  assert.match(searchInput, /@\/styles\/components\/glass-input\.css/);
});

test('component stylesheet entrypoints stay small and delegate large systems to focused partials', () => {
  const componentStyleDir = path.join(projectRoot, 'src/styles/components');
  const oversizedFiles = readdirSync(componentStyleDir)
    .filter(file => file.endsWith('.css'))
    .map(file => {
      const relativePath = `src/styles/components/${file}`;
      const lineCount = readProjectFile(relativePath).trimEnd().split('\n').length;
      return { file, lineCount };
    })
    .filter(({ lineCount }) => lineCount > 360);

  assert.deepEqual(oversizedFiles, []);

  const editorialEntrypoint = readProjectFile('src/styles/components/editorial-listing.css');
  const searchEntrypoint = readProjectFile('src/styles/components/search.css');

  assert.match(editorialEntrypoint, /@import '\.\/editorial-listing\.layout\.css'/);
  assert.match(editorialEntrypoint, /@import '\.\/editorial-filter-controls\.css'/);
  assert.match(searchEntrypoint, /@import '\.\/search-modal\.css'/);
  assert.match(searchEntrypoint, /@import '\.\/search-results\.css'/);
});
