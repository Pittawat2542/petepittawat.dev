import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const projectRoot = path.resolve(import.meta.dirname, '../../../..');

function readProjectFile(relativePath: string) {
  return readFileSync(path.join(projectRoot, relativePath), 'utf8');
}

test('publication card root visibly lifts on hover and keyboard focus', () => {
  const publicationCard = readProjectFile('src/components/ui/publication/PublicationCard.tsx');

  assert.match(publicationCard, /className="[^"]*\bpublication-card\b/);
  assert.match(publicationCard, /className="[^"]*\bhover:-translate-y-1\b/);
  assert.match(publicationCard, /className="[^"]*\bfocus-visible:-translate-y-1\b/);
  assert.match(publicationCard, /className="[^"]*\bmotion-reduce:hover:translate-y-0\b/);
  assert.match(publicationCard, /className="[^"]*\bmotion-reduce:focus-visible:translate-y-0\b/);
});
