import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

import { CONTENT_IMAGE_VERSION, renderCoverPng } from './content-image.ts';

import { getBlogOgImagePath, getBlogOgManifestKey } from '../src/lib/blog-cover/index.ts';
import { extractBlogFrontmatter, type BlogFrontmatter } from './validate-cover-assets.ts';

const ROOT = process.cwd();
const BLOG_DIR = path.join(ROOT, 'src', 'content', 'blog');
const PUBLIC_DIR = path.join(ROOT, 'public');
const MANIFEST_FILE = path.join(ROOT, 'public', 'og', 'manifest.json');
const RENDER_VERSION = `blog-raster-og-v2:${CONTENT_IMAGE_VERSION}`;
type OgManifest = Record<string, { hash: string; generatedAt: string; inputHash?: string }>;

await generate();

async function generate() {
  const [files, manifest] = await Promise.all([collectContentFiles(BLOG_DIR), loadManifest()]);

  // Fail-fast validation step: ensure all posts have valid cover image frontmatter
  let hasValidationErrors = false;
  for (const file of files) {
    const content = await fs.readFile(file, 'utf8');
    const validated = extractBlogFrontmatter(content);
    if (!validated) {
      console.error(
        `Error: Post is missing required cover-asset frontmatter fields (coverImage, lang, routeSlug): ${path.relative(ROOT, file)}`
      );
      hasValidationErrors = true;
    }
  }
  if (hasValidationErrors) {
    console.error('Build aborted: Cover asset validation failed.');
    process.exit(1);
  }

  const updatedManifest: OgManifest = {};
  let generatedCount = 0;
  let skippedCount = 0;

  for (const file of files) {
    const content = await fs.readFile(file, 'utf8');
    const frontmatter = extractBlogFrontmatter(content);
    if (!frontmatter) {
      throw new Error(
        `Failed to parse frontmatter from ${path.relative(ROOT, file)} in generator pass.`
      );
    }

    const sourcePath = path.resolve(path.dirname(file), frontmatter.coverImage);
    const sourceHash = await hashFile(sourcePath);
    const manifestKey = getBlogOgManifestKey({
      lang: frontmatter.lang,
      routeSlug: frontmatter.routeSlug,
    });
    const outPath = path.join(
      PUBLIC_DIR,
      getBlogOgImagePath({ lang: frontmatter.lang, routeSlug: frontmatter.routeSlug }).replace(
        /^\//,
        ''
      )
    );
    const currentHash = createPostHash(frontmatter, sourceHash);
    const inputHash = createPostHash(frontmatter, sourceHash, 'blog-input-v1');
    const previous = manifest[manifestKey];
    const unchangedInput = previous?.inputHash
      ? previous.inputHash === inputHash
      : previous?.hash === createPostHash(frontmatter, sourceHash, 'blog-raster-og-v1') ||
        previous?.hash === currentHash;
    const fileExists = await exists(outPath);
    const isUnchanged = fileExists && unchangedInput && !process.argv.includes('--refresh');

    if (!isUnchanged) {
      await fs.mkdir(path.dirname(outPath), { recursive: true });
      await fs.writeFile(outPath, await renderCoverPng(await fs.readFile(sourcePath)));
      generatedCount += 1;
      console.log(`OG synced: ${path.relative(ROOT, outPath)}`);
    } else {
      skippedCount += 1;
      console.log(`OG skipped: ${path.relative(ROOT, outPath)}`);
    }

    updatedManifest[manifestKey] = {
      hash: isUnchanged && previous ? previous.hash : currentHash,
      inputHash,
      generatedAt:
        isUnchanged && manifest[manifestKey]?.generatedAt
          ? manifest[manifestKey].generatedAt
          : new Date().toISOString(),
    };
  }

  await fs.mkdir(path.dirname(MANIFEST_FILE), { recursive: true });
  await fs.writeFile(MANIFEST_FILE, JSON.stringify(updatedManifest, null, 2));

  console.log(`OG sync complete: ${generatedCount} generated, ${skippedCount} skipped`);
}

async function collectContentFiles(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const nestedFiles = await Promise.all(
    entries.map(async entry => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        return collectContentFiles(fullPath);
      }
      return /\.(md|mdx)$/i.test(entry.name) ? [fullPath] : [];
    })
  );

  return nestedFiles.flat();
}

function createPostHash(
  frontmatter: BlogFrontmatter,
  sourceHash: string,
  version = RENDER_VERSION
) {
  return crypto
    .createHash('sha1')
    .update(
      JSON.stringify({
        version,
        title: frontmatter.title,
        lang: frontmatter.lang,
        routeSlug: frontmatter.routeSlug,
        coverImage: frontmatter.coverImage,
        sourceHash,
      })
    )
    .digest('hex');
}

async function hashFile(filePath: string) {
  const buffer = await fs.readFile(filePath);
  return crypto.createHash('sha1').update(buffer).digest('hex');
}

async function loadManifest() {
  try {
    const content = await fs.readFile(MANIFEST_FILE, 'utf8');
    return JSON.parse(content) as OgManifest;
  } catch {
    return {};
  }
}

async function exists(filePath: string) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}
