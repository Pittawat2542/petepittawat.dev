import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import test from 'node:test';

import projects from '../../content/projects/projects.json' with { type: 'json' };
import publications from '../../content/publications/publications.json' with { type: 'json' };
import talks from '../../content/talks/talks.json' with { type: 'json' };
import {
  RESEARCH_THEMES,
  resolveResearchThemeArtifacts,
  type ResearchArtifactRef,
} from './research-map.ts';

const REPO_ROOT = process.cwd();

test('research map exposes the canonical four homepage research pillars', () => {
  assert.deepEqual(
    RESEARCH_THEMES.map(theme => theme.id),
    ['behavior-shaping', 'evaluation', 'reasoning-models', 'agentic-systems']
  );

  for (const theme of RESEARCH_THEMES) {
    assert.ok(theme.title, `${theme.id} should have a title`);
    assert.ok(theme.summary, `${theme.id} should have a summary`);
    assert.ok(theme.representativeTags.length > 0, `${theme.id} should list representative tags`);
    assert.ok(theme.artifacts.length > 0, `${theme.id} should curate at least one artifact`);
  }
});

test('research map artifact references resolve against existing content', () => {
  const resolved = resolveResearchThemeArtifacts(RESEARCH_THEMES, {
    blogPosts: collectBlogPosts(),
    projects,
    publications,
    talks,
  });

  for (const theme of resolved) {
    assert.equal(theme.unresolved.length, 0, `${theme.id} has unresolved references`);
    assert.ok(theme.artifacts.length > 0, `${theme.id} should resolve at least one artifact`);
  }
});

test('research map does not duplicate artifact references within a theme', () => {
  for (const theme of RESEARCH_THEMES) {
    const keys = theme.artifacts.map(getArtifactRefKey);
    assert.deepEqual(
      keys,
      Array.from(new Set(keys)),
      `${theme.id} contains duplicate artifact references`
    );
  }
});

function getArtifactRefKey(ref: ResearchArtifactRef) {
  return `${ref.type}:${ref.slug ?? ''}:${ref.title ?? ''}:${ref.year ?? ''}:${ref.date ?? ''}`;
}

function collectBlogPosts() {
  const blogDir = path.join(REPO_ROOT, 'src/content/blog/en');
  return fs
    .readdirSync(blogDir)
    .filter(file => file.endsWith('.mdx'))
    .map(file => {
      const content = fs.readFileSync(path.join(blogDir, file), 'utf8');
      const frontmatter = readFrontmatter(content);
      return {
        slug: readScalar(frontmatter, 'routeSlug') ?? file.replace(/\.mdx$/, ''),
        title: readScalar(frontmatter, 'title') ?? '',
      };
    });
}

function readFrontmatter(content: string) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  assert.ok(match, 'Expected MDX frontmatter');
  return match[1] ?? '';
}

function readScalar(frontmatter: string, key: string) {
  const pattern = new RegExp(`^${escapeRegExp(key)}:\\s*(.+)$`, 'm');
  const match = frontmatter.match(pattern);
  if (!match) return undefined;
  const value = (match[1] ?? '').trim();
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
