import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const projectRoot = path.resolve(import.meta.dirname, '../..');

function readProjectFile(relativePath: string) {
  return readFileSync(path.join(projectRoot, relativePath), 'utf8');
}

test('blog post layout no longer owns table-of-contents visuals', () => {
  const layout = readProjectFile('src/layouts/BlogPost.astro');
  const tocComponent = readProjectFile('src/components/layout/blog/Toc.astro');
  assert.equal(existsSync(path.join(projectRoot, 'src/styles/components/toc.css')), true);
  assert.equal(existsSync(path.join(projectRoot, 'src/scripts/toc.ts')), true);
  const tocStyles = readProjectFile('src/styles/components/toc.css');
  const tocScript = readProjectFile('src/scripts/toc.ts');

  assert.doesNotMatch(
    layout,
    /\.toc-summary__label|\.toc-link\[aria-current='location'\]|\.toc-card/
  );
  assert.match(tocComponent, /toc-summary__label/);
  assert.match(tocComponent, /@\/styles\/components\/toc\.css/);
  assert.match(tocComponent, /@\/scripts\/toc/);
  assert.doesNotMatch(tocComponent, /<style is:global>/);
  assert.match(tocStyles, /\.toc-root/);
  assert.match(tocScript, /buildTocItems/);
  assert.match(tocScript, /initToc/);
});

test('blog post layout keeps visual ownership in rendered article modules', () => {
  const layout = readProjectFile('src/layouts/BlogPost.astro');
  const hero = readProjectFile('src/components/layout/blog-post/ArticleHero.astro');
  const brief = readProjectFile('src/components/layout/blog-post/ArticleBrief.astro');
  const rail = readProjectFile('src/components/layout/blog-post/ArticleRail.astro');
  const body = readProjectFile('src/components/layout/blog-post/ArticleBody.astro');
  const surface = readProjectFile('src/styles/components/article-surface.css');
  const languageSwitcher = readProjectFile('src/components/ui/blog/BlogLanguageSwitcher.tsx');

  assert.doesNotMatch(layout, /<style is:global>/);
  assert.doesNotMatch(layout, /\.article-body\s*\{/);
  assert.doesNotMatch(layout, /\.article-hero\s*\{/);
  assert.doesNotMatch(layout, /\.article-rail-sidebar\s*\{/);
  assert.doesNotMatch(layout, /\.article-brief\s*\{/);
  assert.match(hero, /\.article-hero\s*\{/);
  assert.match(brief, /\.article-brief\s*\{/);
  assert.match(rail, /\.article-rail-sidebar\s*\{/);
  assert.match(body, /\.article-body\s*\{/);
  assert.match(surface, /\.article-surface\s*\{/);
  assert.match(languageSwitcher, /@\/styles\/components\/editorial-language-switcher\.css/);
});

test('article brief owns the main-column summary card', () => {
  const layout = readProjectFile('src/layouts/BlogPost.astro');
  const brief = readProjectFile('src/components/layout/blog-post/ArticleBrief.astro');
  const rail = readProjectFile('src/components/layout/blog-post/ArticleRail.astro');

  assert.match(layout, /<ArticleBrief excerpt=\{excerpt\} \/>/);
  assert.match(brief, /interface Props \{[\s\S]*excerpt\?: string/);
  assert.match(brief, /class="article-brief"/);
  assert.match(brief, /class="article-brief__label"/);
  assert.match(brief, /class="article-brief__copy"/);
  assert.doesNotMatch(layout, /class="article-tldr-card"/);
  assert.doesNotMatch(rail, /article-brief|article-note|TL;DR/);
});

test('article rail presents language and toc as one compact persistent reader pane', () => {
  const rail = readProjectFile('src/components/layout/blog-post/ArticleRail.astro');

  assert.match(rail, /<details\s+class="article-reader-pane"[\s\S]*data-reader-pane[\s\S]*open/);
  assert.match(rail, /class="article-reader-pane__summary"/);
  assert.match(rail, /class="article-reader-pane__content"/);
  assert.match(rail, /tone="editorial"/);
  assert.doesNotMatch(rail, /label="Reading language"/);
  assert.doesNotMatch(rail, /Reader console|Choose your edition|Reading language/);
  assert.match(rail, /<Toc[\s\S]*title="Contents"[\s\S]*variant="embedded"/);
  assert.match(rail, /position:\s*sticky/);
  assert.match(rail, /top:\s*var\(\s*--article-rail-sticky-top/);
  assert.match(rail, /height:\s*max-content/);
  assert.match(rail, /overflow:\s*visible/);
  assert.match(rail, /@media \(max-width: 1024px\)[\s\S]*position:\s*static/);
  assert.doesNotMatch(rail, /excerpt/);
});

test('article rail pins below the navbar while constraining pane overflow', () => {
  const layout = readProjectFile('src/layouts/BlogPost.astro');
  const rail = readProjectFile('src/components/layout/blog-post/ArticleRail.astro');

  assert.match(
    layout,
    /--article-rail-sticky-top:\s*calc\(\s*env\(safe-area-inset-top,\s*0px\) \+ var\(--nav-height,\s*3\.35rem\)\s*\)/
  );
  assert.match(layout, /--article-rail-bottom-gap:\s*clamp\(/);
  assert.match(rail, /top:\s*var\(\s*--article-rail-sticky-top/);
  assert.match(
    rail,
    /max-block-size:\s*calc\([\s\S]*100dvh[\s\S]*var\(\s*--article-rail-sticky-top[\s\S]*var\(--article-rail-bottom-gap/
  );
  assert.match(rail, /grid-template-rows:\s*auto minmax\(0,\s*1fr\)/);
  assert.match(rail, /\.article-reader-pane__content[\s\S]*min-block-size:\s*0/);
  assert.match(rail, /\.article-reader-pane__content[\s\S]*overflow-y:\s*auto/);
  assert.match(
    rail,
    /@media \(max-width: 1024px\)[\s\S]*\.article-reader-pane[\s\S]*max-block-size:\s*none/
  );
});

test('table of contents supports embedded rendering without nested disclosure chrome', () => {
  const tocComponent = readProjectFile('src/components/layout/blog/Toc.astro');
  const tocStyles = readProjectFile('src/styles/components/toc.css');

  assert.match(tocComponent, /variant\?:\s*'card' \| 'embedded'/);
  assert.match(tocComponent, /const isEmbedded = variant === 'embedded'/);
  assert.match(tocComponent, /class:list=\{\['toc-root', isEmbedded && 'toc-root--embedded'\]\}/);
  assert.match(tocComponent, /isEmbedded \?/);
  assert.match(tocComponent, /<section class="toc-card" data-toc-shell>/);
  assert.match(tocComponent, /<details class="toc-card">/);
  assert.match(tocStyles, /\.toc-root--embedded \.toc-card[\s\S]*background:\s*transparent/);
});

test('blog post hero is full bleed without editorial badge chrome', () => {
  const layout = readProjectFile('src/layouts/BlogPost.astro');
  const hero = readProjectFile('src/components/layout/blog-post/ArticleHero.astro');

  assert.match(hero, /inline-size:\s*100dvw/);
  assert.match(hero, /margin-inline:\s*calc\(50% - 50dvw\)/);
  assert.match(hero, /border-radius:\s*0/);
  assert.match(hero, /align-items:\s*flex-start/);
  assert.match(hero, /class="article-back"[\s\S]*All posts[\s\S]*article-hero__title/);
  assert.doesNotMatch(hero, /padding:[\s\S]*calc\(var\(--nav-height,\s*3\.35rem\)/);
  assert.match(
    hero,
    /width:\s*min\(var\(--article-content-width,\s*60rem\), calc\(100% - 2rem\)\)/
  );
  assert.doesNotMatch(hero, /Field notes/i);
  assert.doesNotMatch(hero, /article-hero__badge/);
  assert.doesNotMatch(layout, /class="article-back"/);
  assert.match(
    layout,
    /\.article-container[\s\S]*margin:\s*calc\(-1 \* \(var\(--nav-height,\s*3\.35rem\) \+ 1\.25rem\)\) auto 0/
  );
  assert.match(layout, /\.article-container[\s\S]*padding:\s*0 0 clamp/);
});

test('blog post desktop body is viewport-centered with a far-right sticky rail', () => {
  const layout = readProjectFile('src/layouts/BlogPost.astro');
  const rail = readProjectFile('src/components/layout/blog-post/ArticleRail.astro');

  assert.match(layout, /--article-content-width:\s*60rem/);
  assert.match(layout, /--article-rail-width:\s*17rem/);
  assert.match(layout, /--article-side-gutter:\s*clamp\(/);
  assert.match(
    layout,
    /\.article-main[\s\S]*margin-top:\s*clamp\(-1\.35rem,\s*-1\.8vw,\s*-0\.8rem\)/
  );
  assert.match(layout, /\.article-main[\s\S]*inline-size:\s*100dvw/);
  assert.match(layout, /\.article-main[\s\S]*margin-inline:\s*calc\(50% - 50dvw\)/);
  assert.match(
    layout,
    /grid-template-columns:\s*minmax\(var\(--article-side-gutter\),\s*1fr\)\s*minmax\(0,\s*var\(--article-content-width\)\)\s*minmax\(var\(--article-rail-width\),\s*1fr\)/
  );
  assert.match(
    layout,
    /\.article-body-column[\s\S]*grid-column:\s*2[\s\S]*max-inline-size:\s*var\(--article-content-width\)[\s\S]*justify-self:\s*stretch/
  );
  assert.match(
    layout,
    /\.article-main :global\(\.article-rail-sidebar\)[\s\S]*grid-column:\s*3[\s\S]*justify-self:\s*end/
  );
  assert.match(rail, /position:\s*sticky/);
});

test('suggested reading aligns to the centered article content track', () => {
  const layout = readProjectFile('src/layouts/BlogPost.astro');

  assert.match(
    layout,
    /\.article-related[\s\S]*inline-size:\s*min\(100%,\s*var\(--article-content-width\)\)/
  );
  assert.match(layout, /\.article-related[\s\S]*max-width:\s*var\(--article-content-width\)/);
  assert.doesNotMatch(layout, /\.article-related[\s\S]*--article-layout-width/);
});

test('blog post responsive layout places the reader console below the opening brief', () => {
  const layout = readProjectFile('src/layouts/BlogPost.astro');

  assert.match(layout, /@media \(max-width: 1024px\)[\s\S]*\.article-body-column/);
  assert.match(layout, /display:\s*contents/);
  assert.match(layout, /:global\(\.article-brief\)[\s\S]*order:\s*1/);
  assert.match(layout, /:global\(\.article-rail-sidebar\)[\s\S]*order:\s*2/);
  assert.match(layout, /:global\(\.article-body-container\)[\s\S]*order:\s*3/);
});

test('blog post script persists the reader pane disclosure state', () => {
  const script = readProjectFile('src/scripts/blog-post.ts');

  assert.match(script, /READER_PANE_STORAGE_KEY/);
  assert.match(script, /setupReaderPane/);
  assert.match(script, /querySelectorAll\('\[data-reader-pane\]'\)/);
  assert.match(script, /localStorage\.getItem/);
  assert.match(script, /localStorage\.setItem/);
  assert.match(script, /addEventListener\('toggle'/);
});

test('blog post hero raster covers are prioritized as LCP images', () => {
  const layout = readProjectFile('src/layouts/BlogPost.astro');
  const hero = readProjectFile('src/components/layout/blog-post/ArticleHero.astro');
  const blogCover = readProjectFile('src/components/ui/blog/BlogCover.tsx');
  const blogCardImage = readProjectFile('src/components/ui/blog/BlogCardImage.tsx');

  assert.match(layout, /rel="preload"[\s\S]*as="image"[\s\S]*fetchpriority="high"/);
  assert.match(layout, /href=\{coverImage\.src\}/);
  assert.match(layout, /<ArticleHero[\s\S]*excerpt=\{excerpt\}/);
  assert.match(layout, /<ArticleHero[\s\S]*lang=\{lang\}/);
  assert.match(layout, /<ArticleHero[\s\S]*slug=\{slug\}/);
  assert.match(layout, /<ArticleHero[\s\S]*coverImage=\{coverImage\}/);

  assert.match(hero, /import BlogCover from '@\/components\/ui\/blog\/BlogCover'/);
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
  assert.match(blogCover, /srcSet:\s*imageSrcSet/);
  assert.match(blogCover, /sizes:\s*imageSizes/);
  assert.match(blogCover, /\{\.\.\.coverImageAttributes\}/);
  assert.match(blogCardImage, /imageWidth=\{post\.data\.coverImage\?\.width\}/);
  assert.match(blogCardImage, /imageHeight=\{post\.data\.coverImage\?\.height\}/);
  assert.match(blogCardImage, /imageSizes=/);
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
