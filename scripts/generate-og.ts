import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

import sharp from 'sharp';

import {
  getBlogOgImagePath,
  getBlogOgManifestKey,
  type BlogCoverLocale,
} from '../src/lib/blog-cover/index.ts';

const ROOT = process.cwd();
const BLOG_DIR = path.join(ROOT, 'src', 'content', 'blog');
const PUBLIC_DIR = path.join(ROOT, 'public');
const MANIFEST_FILE = path.join(ROOT, 'public', 'og', 'manifest.json');
const RENDER_VERSION = 'blog-raster-og-v1';

type BlogFrontmatter = {
  title: string;
  lang: BlogCoverLocale;
  routeSlug: string;
  coverImage: string;
};

await generate();

async function generate() {
  const [files, manifest] = await Promise.all([collectContentFiles(BLOG_DIR), loadManifest()]);

  const updatedManifest: Record<string, { hash: string; generatedAt: string }> = {};
  let generatedCount = 0;
  let skippedCount = 0;

  for (const file of files) {
    const content = await fs.readFile(file, 'utf8');
    const frontmatter = extractFrontmatter(content);
    if (!frontmatter) {
      continue;
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
    const previousHash = manifest[manifestKey]?.hash;
    const fileExists = await exists(outPath);

    if (!fileExists || previousHash !== currentHash) {
      await fs.mkdir(path.dirname(outPath), { recursive: true });
      await sharp(sourcePath)
        .resize(1200, 630, { fit: 'cover', position: 'center' })
        .png({ compressionLevel: 9, adaptiveFiltering: true })
        .toFile(outPath);
      generatedCount += 1;
      console.log(`OG synced: ${path.relative(ROOT, outPath)}`);
    } else {
      skippedCount += 1;
      console.log(`OG skipped: ${path.relative(ROOT, outPath)}`);
    }

    updatedManifest[manifestKey] = {
      hash: currentHash,
      generatedAt: new Date().toISOString(),
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

function extractFrontmatter(content: string): BlogFrontmatter | undefined {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  const frontmatter = frontmatterMatch?.[1];
  if (!frontmatter) {
    return undefined;
  }

  const title = readScalar(frontmatter, 'title');
  const lang = readScalar(frontmatter, 'lang');
  const routeSlug = readScalar(frontmatter, 'routeSlug');
  const coverImage = readScalar(frontmatter, 'coverImage');

  if (!title || !routeSlug || !coverImage || (lang !== 'en' && lang !== 'th')) {
    return undefined;
  }

  return {
    title,
    lang,
    routeSlug,
    coverImage,
  };
}

function readScalar(frontmatter: string, key: string): string | undefined {
  const pattern = new RegExp(`^${escapeRegExp(key)}:\\s*(.+)$`, 'm');
  const match = frontmatter.match(pattern);
  const value = match?.[1];
  if (!value) {
    return undefined;
  }

  return stripWrappedQuotes(value.trim());
}

function stripWrappedQuotes(value: string) {
  if (
    (value.startsWith("'") && value.endsWith("'")) ||
    (value.startsWith('"') && value.endsWith('"'))
  ) {
    return value.slice(1, -1).replace(/''/g, "'");
  }
  return value;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function createPostHash(frontmatter: BlogFrontmatter, sourceHash: string) {
  return crypto
    .createHash('sha1')
    .update(
      JSON.stringify({
        version: RENDER_VERSION,
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
    return JSON.parse(content) as Record<string, { hash: string; generatedAt: string }>;
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
