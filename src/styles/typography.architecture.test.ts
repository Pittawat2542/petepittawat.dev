import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import test from 'node:test';

const root = new URL('../../', import.meta.url).pathname;

function runtimeFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const path = join(directory, entry.name);
    // Content illustrations and generated artwork have their own fixed canvas scale.
    if (entry.isDirectory()) {
      return ['content', 'assets'].includes(entry.name) ? [] : runtimeFiles(path);
    }
    return /\.(astro|css|tsx)$/.test(entry.name) ? [path] : [];
  });
}

test('runtime typography uses the shared scale instead of independent font sizes', () => {
  const violations: string[] = [];
  for (const path of runtimeFiles(join(root, 'src'))) {
    const source = readFileSync(path, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
    for (const [index, line] of source.split('\n').entries()) {
      // Relative em sizing in article code/math is intentional: it tracks prose size.
      const sizes = [...line.matchAll(/font-size:\s*([^;\n}]+)/g)];
      for (const [, value = ''] of sizes) {
        if (/\d/.test(value) && !value.includes('var(--') && !/^\d*\.?\d+em$/.test(value.trim())) {
          violations.push(`${relative(root, path)}:${index + 1}: ${value}`);
        }
      }
      if (/(?:^|[\s:'"`])(?:[\w-]+:)*text-\[\d/.test(line)) {
        violations.push(`${relative(root, path)}:${index + 1}: arbitrary text size`);
      }
    }
  }
  assert.deepEqual(violations, [], `Use a semantic --type-* token:\n${violations.join('\n')}`);
});
