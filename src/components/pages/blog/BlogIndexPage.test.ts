import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
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

test('listing explorers use the shared editorial explorer abstraction', () => {
  const projectsExplorer = readProjectFile('src/components/explorers/ProjectsExplorer.tsx');
  const publicationsExplorer = readProjectFile('src/components/explorers/PublicationsExplorer.tsx');
  const talksExplorer = readProjectFile('src/components/explorers/TalksExplorer.tsx');

  for (const explorer of [projectsExplorer, publicationsExplorer, talksExplorer]) {
    assert.match(
      explorer,
      /import\s+\{\s*EditorialExplorer\s*\}\s+from\s+['"]\.\/EditorialExplorer['"]/
    );
    assert.doesNotMatch(explorer, /DataExplorer/);
  }
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
  const dataExplorer = readProjectFile('src/components/explorers/DataExplorer.tsx');
  const editorialShell = readProjectFile('src/components/explorers/EditorialListingShell.tsx');

  for (const file of [blogListPage, editorialExplorer, dataExplorer, editorialShell]) {
    assert.doesNotMatch(file, /usePagination/);
    assert.doesNotMatch(file, /PageControls/);
  }

  assert.match(blogListPage, /sorted\.map/);
  assert.doesNotMatch(blogListPage, /pagePosts/);
  assert.match(editorialExplorer, /sorted\.map/);
  assert.doesNotMatch(editorialExplorer, /paged/);
  assert.match(dataExplorer, /sorted\.map/);
  assert.doesNotMatch(dataExplorer, /paged/);
  assert.doesNotMatch(editorialShell, /pagination/);
});

test('listing animations never hide primary content while waiting for reveal JavaScript', () => {
  const blogListPage = readProjectFile('src/components/layout/BlogListPage.tsx');
  const editorialExplorer = readProjectFile('src/components/explorers/EditorialExplorer.tsx');
  const dataExplorer = readProjectFile('src/components/explorers/DataExplorer.tsx');
  const interactionExports = readProjectFile('src/components/ui/interaction/index.ts');
  const globalStyles = readProjectFile('src/styles/global.css');

  for (const file of [blogListPage, editorialExplorer, dataExplorer]) {
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
