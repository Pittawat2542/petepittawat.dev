import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, readdir, stat } from 'node:fs/promises';
import { resolve, join, dirname } from 'node:path';
import { gzipSync } from 'node:zlib';

const root = resolve(process.argv[2] ?? 'dist');
const routes = ['blog', 'projects', 'publications', 'talks', 'tags/ai'];
const report = [];
const coverReport = [];
const routeHtml = new Map();
const attribute = (tag, name) => tag.match(new RegExp(`(?:^|\\s)${name}="([^"]*)"`))?.[1];
async function graph(path, found = new Map()) {
  if (found.has(path)) return found;
  const bytes = await readFile(path);
  found.set(path, bytes);
  const code = bytes.toString();
  const imports =
    /\b(?:import\s*(?:[\w$*{][^;]*?\s*from\s*)?|export\s*[^;]*?\s*from\s*)['"`]([^'"`]+)['"`]/g;
  for (const match of code.matchAll(imports))
    if (match[1].startsWith('.')) await graph(resolve(dirname(path), match[1]), found);
  return found;
}
for (const route of routes) {
  const html = await readFile(join(root, route, 'index.html'), 'utf8');
  routeHtml.set(route, html);
  assert(!html.includes('<astro-island'), `${route} must not hydrate a listing or search island`);
  const files = new Map();
  for (const tag of html.matchAll(/<script\b[^>]*>/g)) {
    const src = attribute(tag[0], 'src');
    if (src?.endsWith('.js')) await graph(join(root, src), files);
  }
  for (const tag of html.matchAll(/<link\b[^>]*>/g)) {
    const href = attribute(tag[0], 'href');
    if (attribute(tag[0], 'rel') === 'modulepreload' && href?.endsWith('.js'))
      await graph(join(root, href), files);
  }
  let inlineGzip = 0;
  for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)) {
    if (
      !attribute(match[1], 'src') &&
      attribute(match[1], 'type') !== 'application/ld+json' &&
      match[2].trim()
    )
      inlineGzip += gzipSync(match[2]).length;
  }
  const jsGzip =
    inlineGzip + [...files.values()].reduce((sum, bytes) => sum + gzipSync(bytes).length, 0);
  assert(jsGzip < 20 * 1024, `${route}: initial JS exceeds 20 KiB gzip`);
  for (const [path, bytes] of files)
    assert(
      !/react\.transitional\.element|react\.element|radix-ui/.test(bytes.toString()),
      `${route}: React/Radix eagerly loaded in ${path}`
    );
  let cssBytes = 0;
  for (const tag of html.matchAll(/<link\b[^>]*>/g))
    if (attribute(tag[0], 'rel') === 'stylesheet')
      cssBytes += (await stat(join(root, attribute(tag[0], 'href')))).size;
  // Baseline: BaseLayout 249292 + EditorialListingShell 19102 bytes.
  assert(cssBytes <= 268394, `${route}: initial CSS grew beyond the baseline`);

  if (route === 'blog') {
    for (const tag of html.matchAll(/<img\b[^>]*>/g)) {
      const src = attribute(tag[0], 'src');
      if (!src?.includes('/cover.')) continue;
      assert(src.endsWith('.webp'), 'Blog cards must use WebP covers');
      assert(attribute(tag[0], 'srcSet') ?? attribute(tag[0], 'srcset'), 'Blog covers need srcset');
      assert(attribute(tag[0], 'sizes'), 'Blog covers need sizes');
      assert(
        attribute(tag[0], 'width') && attribute(tag[0], 'height'),
        'Blog covers need dimensions'
      );
      const originalStem = src.replace(/_[^/_]+\.webp$/, '.png');
      const original = await stat(join(root, originalStem));
      const optimized = await stat(join(root, src));
      assert(optimized.size <= original.size * 0.3, `${src}: cover reduction is below 70%`);
      coverReport.push({ original: original.size, optimized: optimized.size });
    }
    const fragmentUrl = attribute(
      html.match(/<section\b[^>]*data-static-listing[^>]*>/)?.[0] ?? '',
      'data-locale-url'
    );
    assert(fragmentUrl, 'Missing alternate language fragment');
    const fragment = await readFile(join(root, fragmentUrl, 'index.html'));
    assert(
      fragmentUrl.includes(createHash('sha256').update(fragment).digest('hex').slice(0, 16)),
      'Fragment URL must hash its rendered contents'
    );
    assert(fragment.includes(Buffer.from('data-listing-item')));
  }
  report.push({
    route: `/${route}/`,
    initialJsGzipKiB: +(jsGzip / 1024).toFixed(2),
    initialCssKiB: +(cssBytes / 1024).toFixed(2),
    htmlGzipKiB: +(gzipSync(html).length / 1024).toFixed(2),
  });
}
// Search links must point at the build-rendered listing IDs.
const index = JSON.parse(await readFile(join(root, 'search.json'), 'utf8'));
for (const item of index.items.filter(item =>
  ['publication', 'project', 'talk'].includes(item.type)
)) {
  const url = new URL(item.url, 'https://local.invalid');
  if (url.hash)
    assert(
      routeHtml.get(url.pathname.replace(/^\/|\/$/g, ''))?.includes(`id="${url.hash.slice(1)}"`),
      `Broken search anchor: ${item.url}`
    );
}
const sitemap = await readFile(join(root, 'sitemap-0.xml'), 'utf8');
assert(!sitemap.includes('/listing-assets/'), 'Locale fragments must stay out of the sitemap');
// Social preview images and downloadable resources remain available.
assert((await readdir(join(root, 'og'))).length > 0);
assert((await readFile(join(root, 'CNAME'), 'utf8')).trim() === 'petepittawat.dev');
const originalCovers = coverReport.reduce((total, cover) => total + cover.original, 0);
const optimizedCovers = coverReport.reduce((total, cover) => total + cover.optimized, 0);
// Cover sizing must stay valid on the homepage and full-bleed article heroes too.
for (const route of ['', 'blog/the-common-language-of-knowledge']) {
  const html = await readFile(join(root, route, 'index.html'), 'utf8');
  for (const match of html.matchAll(/<img\b[^>]*>/g)) {
    const tag = match[0];
    if (!attribute(tag, 'src')?.includes('/cover.')) continue;
    assert(attribute(tag, 'src').endsWith('.webp'), `${route}: cover must use WebP`);
    assert(attribute(tag, 'srcset') ?? attribute(tag, 'srcSet'), `${route}: missing srcset`);
    assert(attribute(tag, 'width') && attribute(tag, 'height'), `${route}: missing dimensions`);
    const sizes = attribute(tag, 'sizes');
    assert(sizes, `${route}: missing sizes`);
    if (sizes.startsWith('auto'))
      assert(attribute(tag, 'loading') === 'lazy', 'Automatic image sizes require lazy loading');
    if (route && attribute(tag, 'loading') === 'eager') {
      assert(sizes === '100vw', 'Article heroes must use their full viewport width');
      assert(html.includes('imagesizes="100vw"'), 'Article preload must match hero sizing');
    }
  }
}
console.log(
  JSON.stringify(
    {
      routes: report,
      largestCoverDownloadReductionPercent: +(
        100 -
        (optimizedCovers / originalCovers) * 100
      ).toFixed(1),
    },
    null,
    2
  )
);
