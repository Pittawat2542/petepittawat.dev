import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import sharp from 'sharp';

import { getBlogOgImagePath, type BlogCoverLocale } from '../src/lib/blog-cover/index.ts';
import {
  resolveCardVisualSpec,
  toProjectCardVisualInput,
  toPublicationCardVisualInput,
  toTalkCardVisualInput,
} from '../src/lib/card-visual/index.ts';

const ROOT = process.cwd();
const BLOG_DIR = path.join(ROOT, 'src', 'content', 'blog');
const PUBLIC_DIR = path.join(ROOT, 'public');
const PROJECTS_FILE = path.join(ROOT, 'src', 'content', 'projects', 'projects.json');
const PUBLICATIONS_FILE = path.join(ROOT, 'src', 'content', 'publications', 'publications.json');
const TALKS_FILE = path.join(ROOT, 'src', 'content', 'talks', 'talks.json');

type BlogFrontmatter = {
  lang: BlogCoverLocale;
  routeSlug: string;
  coverImage: string;
};

type ProjectJson = {
  title: string;
  tags: string[];
  type?: string | undefined;
  year: number;
};

type PublicationJson = {
  title: string;
  tags: string[];
  type: string;
  year: number;
};

type TalkJson = {
  date: string;
  title: string;
  tags: string[];
  mode?: string | undefined;
};

const errors: string[] = [];

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);

if (isMain) {
  await validate();

  if (errors.length > 0) {
    for (const error of errors) {
      console.error(error);
    }
    process.exitCode = 1;
  } else {
    console.log('Cover asset validation complete.');
  }
}

async function validate() {
  await validateBlogCoverReferences();
  await validateCardVisualReferences();
}

async function validateBlogCoverReferences() {
  const files = await collectContentFiles(BLOG_DIR);

  for (const file of files) {
    const content = await fs.readFile(file, 'utf8');
    const frontmatter = extractBlogFrontmatter(content);
    const relativeFile = path.relative(ROOT, file);

    if (!frontmatter) {
      errors.push(`Missing required blog image frontmatter: ${relativeFile}`);
      continue;
    }

    const sourcePath = path.resolve(path.dirname(file), frontmatter.coverImage);
    await assertFileExists(sourcePath, `Blog cover source missing for ${relativeFile}`);

    const ogPath = path.join(
      PUBLIC_DIR,
      getBlogOgImagePath({ lang: frontmatter.lang, routeSlug: frontmatter.routeSlug }).replace(
        /^\//,
        ''
      )
    );
    await assertImageDimensions(ogPath, 1200, 630, `Blog OG image invalid for ${relativeFile}`);
  }
}

async function validateCardVisualReferences() {
  const [projects, publications, talks] = await Promise.all([
    readJsonArray<ProjectJson>(PROJECTS_FILE),
    readJsonArray<PublicationJson>(PUBLICATIONS_FILE),
    readJsonArray<TalkJson>(TALKS_FILE),
  ]);

  const specs = [
    ...projects.map(item => resolveCardVisualSpec(toProjectCardVisualInput(item))),
    ...publications.map(item => resolveCardVisualSpec(toPublicationCardVisualInput(item))),
    ...talks.map(item => resolveCardVisualSpec(toTalkCardVisualInput(item))),
  ];

  for (const spec of specs) {
    const imagePath = path.join(PUBLIC_DIR, spec.imagePath.replace(/^\//, ''));
    await assertImageDimensions(
      imagePath,
      1200,
      630,
      `Card visual invalid for ${spec.collection}:${spec.slug}`
    );
  }
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

export function extractBlogFrontmatter(content: string): BlogFrontmatter | undefined {
  const frontmatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const frontmatter = frontmatterMatch?.[1];
  if (!frontmatter) {
    return undefined;
  }

  const lang = readScalar(frontmatter, 'lang');
  const routeSlug = readScalar(frontmatter, 'routeSlug');
  const coverImage = readScalar(frontmatter, 'coverImage');

  if (!routeSlug || !coverImage || (lang !== 'en' && lang !== 'th')) {
    return undefined;
  }

  return {
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

async function readJsonArray<T>(filePath: string): Promise<T[]> {
  const content = await fs.readFile(filePath, 'utf8');
  const parsed = JSON.parse(content) as unknown;

  if (!Array.isArray(parsed)) {
    throw new Error(`${path.relative(ROOT, filePath)} must contain a JSON array.`);
  }

  return parsed as T[];
}

async function assertFileExists(filePath: string, message: string) {
  try {
    await fs.access(filePath);
  } catch {
    errors.push(`${message}: ${path.relative(ROOT, filePath)}`);
  }
}

async function assertImageDimensions(
  filePath: string,
  width: number,
  height: number,
  message: string
) {
  try {
    const metadata = await sharp(filePath).metadata();
    if (metadata.width !== width || metadata.height !== height) {
      errors.push(
        `${message}: ${path.relative(ROOT, filePath)} is ${metadata.width ?? 0}x${metadata.height ?? 0}, expected ${width}x${height}`
      );
    }
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    errors.push(`${message}: ${path.relative(ROOT, filePath)} (${detail})`);
  }
}
