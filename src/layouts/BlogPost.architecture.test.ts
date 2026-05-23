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

test('blog post layout keeps visual ownership in rendered article modules', () => {
  const layout = readProjectFile('src/layouts/BlogPost.astro');
  const hero = readProjectFile('src/components/layout/blog-post/ArticleHero.astro');
  const rail = readProjectFile('src/components/layout/blog-post/ArticleRail.astro');
  const body = readProjectFile('src/components/layout/blog-post/ArticleBody.astro');
  const surface = readProjectFile('src/styles/components/article-surface.css');

  assert.doesNotMatch(layout, /<style is:global>/);
  assert.doesNotMatch(layout, /\.article-body\s*\{/);
  assert.doesNotMatch(layout, /\.article-hero\s*\{/);
  assert.doesNotMatch(layout, /\.article-rail\s*\{/);
  assert.match(hero, /\.article-hero\s*\{/);
  assert.match(rail, /\.article-rail\s*\{/);
  assert.match(body, /\.article-body\s*\{/);
  assert.match(surface, /\.article-surface\s*\{/);
});

test('blog post hero raster covers are prioritized as LCP images', () => {
  const layout = readProjectFile('src/layouts/BlogPost.astro');
  const hero = readProjectFile('src/components/layout/blog-post/ArticleHero.astro');
  const blogCover = readProjectFile('src/components/ui/blog/BlogCover.tsx');
  const blogCardImage = readProjectFile('src/components/ui/blog/BlogCardImage.tsx');

  assert.match(layout, /rel="preload"[\s\S]*as="image"[\s\S]*fetchpriority="high"/);
  assert.match(layout, /href=\{coverImage\.src\}/);

  assert.match(hero, /imageLoading="eager"/);
  assert.match(hero, /imageFetchPriority="high"/);
  assert.match(hero, /imageDecoding="sync"/);
  assert.match(hero, /imageWidth=\{coverImage\?\.width\}/);
  assert.match(hero, /imageHeight=\{coverImage\?\.height\}/);

  assert.match(blogCover, /imageLoading\s*=\s*'lazy'/);
  assert.match(blogCover, /loading=\{imageLoading\}/);
  assert.match(blogCover, /fetchPriority:\s*imageFetchPriority/);
  assert.match(blogCover, /width:\s*imageWidth/);
  assert.match(blogCover, /height:\s*imageHeight/);
  assert.match(blogCover, /\{\.\.\.coverImageAttributes\}/);
  assert.doesNotMatch(blogCardImage, /imageLoading="eager"|imageFetchPriority="high"/);
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
