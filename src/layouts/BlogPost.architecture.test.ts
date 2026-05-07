import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const projectRoot = path.resolve(import.meta.dirname, '../..');

function readProjectFile(relativePath: string) {
  return readFileSync(path.join(projectRoot, relativePath), 'utf8');
}

test('blog post layout no longer owns table-of-contents visuals', () => {
  const layout = readProjectFile('src/layouts/BlogPost.astro');
  const tocComponent = readProjectFile('src/components/layout/blog/Toc.astro');

  assert.doesNotMatch(
    layout,
    /\.toc-summary__label|\.toc-link\[aria-current='location'\]|\.toc-card/
  );
  assert.match(tocComponent, /toc-summary__label/);
  assert.match(tocComponent, /<style is:global>/);
});

test('related posts visuals are no longer defined inside the blog post layout', () => {
  const layout = readProjectFile('src/layouts/BlogPost.astro');
  const relatedPosts = readProjectFile('src/components/content/RelatedPosts.tsx');

  assert.doesNotMatch(
    layout,
    /\.article-related-section|\.article-related-card|\.article-related-link/
  );
  assert.match(relatedPosts, /import ['"]@\/styles\/components\/related-posts\.css['"]/);
});
