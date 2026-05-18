import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const projectRoot = path.resolve(import.meta.dirname, '../..');
const runtimeRoots = ['src/components', 'src/layouts', 'src/pages', 'src/styles'];
const runtimeExtensions = new Set(['.astro', '.css', '.ts', '.tsx']);

const allowedDefinitionFiles = new Set(['src/styles/tokens.css', 'src/styles/global.css']);

function walkFiles(directory: string): string[] {
  const entries = readdirSync(directory);
  return entries.flatMap(entry => {
    const absolutePath = path.join(directory, entry);
    const stats = statSync(absolutePath);

    if (stats.isDirectory()) {
      return walkFiles(absolutePath);
    }

    if (!runtimeExtensions.has(path.extname(entry))) {
      return [];
    }

    return [absolutePath];
  });
}

function toProjectPath(absolutePath: string) {
  return path.relative(projectRoot, absolutePath).split(path.sep).join('/');
}

function isTokenDefinitionLine(projectPath: string, line: string) {
  if (!allowedDefinitionFiles.has(projectPath)) {
    return false;
  }

  return /--(?:text|type|leading)-/.test(line);
}

test('runtime typography uses project text tokens instead of raw numeric font sizes', () => {
  const violations: string[] = [];

  for (const root of runtimeRoots) {
    const absoluteRoot = path.join(projectRoot, root);
    for (const file of walkFiles(absoluteRoot)) {
      const projectPath = toProjectPath(file);
      const lines = readFileSync(file, 'utf8').split('\n');

      lines.forEach((line, index) => {
        if (isTokenDefinitionLine(projectPath, line)) {
          return;
        }

        if (/font-size:\s*(?:clamp\(|[\d.]+(?:rem|px))/.test(line)) {
          violations.push(`${projectPath}:${index + 1}: ${line.trim()}`);
        }

        if (/text-\[(?:clamp\(|[\d.]+(?:rem|px|em))/.test(line)) {
          violations.push(`${projectPath}:${index + 1}: ${line.trim()}`);
        }
      });
    }
  }

  assert.deepEqual(violations, []);
});
