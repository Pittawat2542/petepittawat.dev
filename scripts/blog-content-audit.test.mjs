import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const REPO_ROOT = process.cwd();
const BLOG_ROOT = path.join(REPO_ROOT, 'src/content/blog');

test('blog content uses locale folders only', () => {
  const files = collectMdxFiles(BLOG_ROOT);
  const rootLevel = files.filter(file => path.dirname(file) === BLOG_ROOT);
  assert.deepEqual(rootLevel, []);
});

test('every translation group has exactly one English and one Thai variant', () => {
  const files = collectMdxFiles(BLOG_ROOT);
  const groups = new Map();

  for (const file of files) {
    const frontmatter = readFrontmatter(fs.readFileSync(file, 'utf8'));
    const translationId = readScalar(frontmatter, 'translationId');
    const lang = readScalar(frontmatter, 'lang');

    assert.ok(translationId, `Missing translationId in ${path.relative(REPO_ROOT, file)}`);
    assert.ok(lang === 'en' || lang === 'th', `Invalid lang in ${path.relative(REPO_ROOT, file)}`);

    const group = groups.get(translationId) ?? [];
    group.push({ file, lang });
    groups.set(translationId, group);
  }

  for (const [translationId, group] of groups) {
    const langs = group.map(item => item.lang).sort();
    assert.deepEqual(
      langs,
      ['en', 'th'],
      `Expected ${translationId} to have exactly one English and one Thai post`
    );
  }
});

test('public route slugs and internal slugs are canonicalized per locale', () => {
  const files = collectMdxFiles(BLOG_ROOT);

  for (const file of files) {
    const frontmatter = readFrontmatter(fs.readFileSync(file, 'utf8'));
    const lang = readScalar(frontmatter, 'lang');
    const routeSlug = readScalar(frontmatter, 'routeSlug');
    const translationId = readScalar(frontmatter, 'translationId');
    const slug = readScalar(frontmatter, 'slug');

    assert.equal(routeSlug, translationId, `routeSlug should match translationId in ${file}`);
    assert.equal(slug, `${routeSlug}-${lang}`, `Unexpected internal slug in ${file}`);
  }
});

test('blog MDX JSX string props do not contain unescaped nested double quotes', () => {
  const files = collectMdxFiles(BLOG_ROOT);
  const offendingProps = [];

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const relativeFile = path.relative(REPO_ROOT, file);

    for (const prop of ['caption', 'alt']) {
      const matches = findBrokenJsxStringProps(content, prop);
      for (const match of matches) {
        offendingProps.push(`${relativeFile}:${match.line} ${match.snippet}`);
      }
    }
  }

  assert.deepEqual(
    offendingProps,
    [],
    `Found JSX string props with unescaped nested double quotes:\n${offendingProps.join('\n')}`
  );
});

test('blog MDX files import local components they use', () => {
  const files = collectMdxFiles(BLOG_ROOT);
  const componentNames = ['Callout', 'Figure', 'Latex'];
  const missingImports = [];

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const relativeFile = path.relative(REPO_ROOT, file);

    for (const componentName of componentNames) {
      const usesComponent = new RegExp(`<${componentName}\\b`).test(content);
      const importsComponent = new RegExp(`^import ${componentName}\\b`, 'm').test(content);

      if (usesComponent && !importsComponent) {
        missingImports.push(`${relativeFile}: missing import for ${componentName}`);
      }
    }
  }

  assert.deepEqual(
    missingImports,
    [],
    `Found blog MDX files using local components without imports:\n${missingImports.join('\n')}`
  );
});

test('blog MDX files import identifiers used in src expression props', () => {
  const files = collectMdxFiles(BLOG_ROOT);
  const missingIdentifiers = [];

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const importedNames = collectImportedNames(content);
    const relativeFile = path.relative(REPO_ROOT, file);
    const srcExpressionPattern = /src=\{([A-Za-z_][A-Za-z0-9_]*)\}/g;

    for (const match of content.matchAll(srcExpressionPattern)) {
      const identifier = match[1];
      if (!importedNames.has(identifier)) {
        missingIdentifiers.push(`${relativeFile}: missing import for src identifier ${identifier}`);
      }
    }
  }

  assert.deepEqual(
    missingIdentifiers,
    [],
    `Found blog MDX files using src expression identifiers without imports:\n${missingIdentifiers.join('\n')}`
  );
});

function collectMdxFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files = [];
  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(collectMdxFiles(entryPath));
    } else if (entry.isFile() && entry.name.endsWith('.mdx')) {
      files.push(entryPath);
    }
  }
  return files.sort();
}

function findBrokenJsxStringProps(content, propName) {
  const results = [];
  const lines = content.split('\n');
  const pattern = new RegExp(`${propName}="[^"\\n]*"[^\\s/>][^"\\n]*"`, 'g');

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const matches = line.matchAll(pattern);
    for (const match of matches) {
      results.push({
        line: index + 1,
        snippet: match[0],
      });
    }
  }

  return results;
}

function collectImportedNames(content) {
  const importedNames = new Set();
  const importPattern = /^import\s+([A-Za-z_][A-Za-z0-9_]*)\b/mg;

  for (const match of content.matchAll(importPattern)) {
    importedNames.add(match[1]);
  }

  return importedNames;
}

function readFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  assert.ok(match, 'Expected MDX frontmatter');
  return match[1];
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

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
