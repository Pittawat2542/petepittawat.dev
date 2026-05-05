#!/usr/bin/env node

import { existsSync } from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const REPO_ROOT = process.cwd();
const BLOG_ROOT = path.join(REPO_ROOT, 'src/content/blog');
const FRONTMATTER_PATTERN = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/;

async function main() {
  const files = await collectMdxFiles(BLOG_ROOT);

  for (const filePath of files) {
    const source = await fs.readFile(filePath, 'utf8');
    const match = source.match(FRONTMATTER_PATTERN);
    if (!match) {
      throw new Error(`Expected frontmatter in ${path.relative(REPO_ROOT, filePath)}`);
    }

    const [, frontmatter, body] = match;
    const lang = readScalar(frontmatter, 'lang');
    if (lang !== 'en' && lang !== 'th') {
      throw new Error(`Unsupported or missing lang in ${path.relative(REPO_ROOT, filePath)}`);
    }

    const sourceSlug = readScalar(frontmatter, 'slug');
    if (!sourceSlug) {
      throw new Error(`Missing slug in ${path.relative(REPO_ROOT, filePath)}`);
    }

    const translationId =
      readScalar(frontmatter, 'translationId') ??
      readScalar(frontmatter, 'routeSlug') ??
      stripLangSuffix(sourceSlug);
    const routeSlug = readScalar(frontmatter, 'routeSlug') ?? translationId;
    const internalSlug = `${routeSlug}-${lang}`;
    const targetDir = path.join(BLOG_ROOT, lang);
    const targetPath = path.join(targetDir, `${routeSlug}.mdx`);

    let normalizedFrontmatter = frontmatter;
    normalizedFrontmatter = setScalar(normalizedFrontmatter, 'slug', internalSlug);
    normalizedFrontmatter = setScalar(normalizedFrontmatter, 'routeSlug', routeSlug);
    normalizedFrontmatter = setScalar(normalizedFrontmatter, 'lang', lang);
    normalizedFrontmatter = setScalar(normalizedFrontmatter, 'translationId', translationId);

    const coverImage = readScalar(normalizedFrontmatter, 'coverImage');
    if (coverImage?.startsWith('.')) {
      normalizedFrontmatter = setScalar(
        normalizedFrontmatter,
        'coverImage',
        rewriteRelativePath({
          currentPath: filePath,
          targetPath,
          relativeValue: coverImage,
        })
      );
    }

    let normalizedBody = rewriteImportPaths({
      body,
      currentPath: filePath,
      targetPath,
    });
    normalizedBody = normalizedBody.replace(/^\n+/, '');

    const normalized = `---\n${normalizedFrontmatter.trim()}\n---\n\n${normalizedBody}`;

    await fs.mkdir(targetDir, { recursive: true });
    await fs.writeFile(targetPath, normalized, 'utf8');

    if (filePath !== targetPath) {
      await fs.unlink(filePath);
    }
  }
}

async function collectMdxFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectMdxFiles(entryPath)));
    } else if (entry.isFile() && entry.name.endsWith('.mdx')) {
      files.push(entryPath);
    }
  }

  return files.sort();
}

function readScalar(frontmatter, key) {
  const pattern = new RegExp(`^${escapeRegExp(key)}:\\s*(.+)$`, 'm');
  const match = frontmatter.match(pattern);
  if (!match) return undefined;
  const value = match[1].trim();
  if (
    (value.startsWith("'") && value.endsWith("'")) ||
    (value.startsWith('"') && value.endsWith('"'))
  ) {
    return value.slice(1, -1).replace(/''/g, "'");
  }
  return value;
}

function setScalar(frontmatter, key, value) {
  const line = `${key}: ${renderYamlString(value)}`;
  const pattern = new RegExp(`^${escapeRegExp(key)}:\\s*(.+)$`, 'm');
  if (pattern.test(frontmatter)) {
    return frontmatter.replace(pattern, line);
  }
  return `${frontmatter.trimEnd()}\n${line}`;
}

function rewriteImportPaths({ body, currentPath, targetPath }) {
  return body.replace(
    /^import\s+(.+?)\s+from\s+(['"])(\.[^'"]+)\2;?$/gm,
    (full, specifier, quote, relativeValue) => {
      const rewritten = rewriteRelativePath({
        currentPath,
        targetPath,
        relativeValue,
      });
      return `import ${specifier} from ${quote}${rewritten}${quote};`;
    }
  );
}

function rewriteRelativePath({ currentPath, targetPath, relativeValue }) {
  const currentDir = path.dirname(currentPath);
  const targetDir = path.dirname(targetPath);
  const currentResolution = path.resolve(currentDir, relativeValue);
  const legacyRootResolution = path.resolve(BLOG_ROOT, relativeValue.slice(2));
  const absoluteTarget = pathMatches(currentResolution)
    ? currentResolution
    : legacyRootResolution;
  let nextRelative = path.relative(targetDir, absoluteTarget).split(path.sep).join('/');
  if (!nextRelative.startsWith('.')) {
    nextRelative = `./${nextRelative}`;
  }
  return nextRelative;
}

function stripLangSuffix(value) {
  return value.replace(/-(en|th)$/, '');
}

function renderYamlString(value) {
  return `'${String(value).replace(/'/g, "''")}'`;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function pathMatches(filePath) {
  return existsSync(filePath);
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
