import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const projectRoot = path.resolve(import.meta.dirname, '../../../..');

function readProjectFile(relativePath: string) {
  return readFileSync(path.join(projectRoot, relativePath), 'utf8');
}

test('blog cover decorations serialize numeric SVG attributes stably for hydration', () => {
  const decorations = readProjectFile('src/components/ui/blog/BlogCoverDecorations.tsx');

  assert.match(decorations, /function svgNumber/);
  assert.match(decorations, /cx={svgNumber\(layer\.cx\)}/);
  assert.match(decorations, /cy={svgNumber\(layer\.cy\)}/);
  assert.match(decorations, /filter: `blur\(\${svgNumber\(layer\.blur\)}px\)`/);
  assert.match(decorations, /rotate\(\${svgNumber\(layer\.rotation\)}/);
});
