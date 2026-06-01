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

test('publication card keeps venue out of metadata and moves authors into overflow chips', () => {
  const publicationCard = readProjectFile('src/components/ui/publication/PublicationCard.tsx');
  const authorList = readProjectFile('src/components/ui/publication/AuthorList.tsx');

  assert.doesNotMatch(publicationCard, /Building2/);
  assert.doesNotMatch(publicationCard, /data-card-description/);
  assert.match(publicationCard, /<AuthorChipList/);
  assert.match(publicationCard, /cardViewportRowClassName/);
  assert.match(publicationCard, /overflowLabel=\{`Show all authors for \$\{item\.title\}`\}/);
  assert.match(publicationCard, /Venue/);
  assert.match(publicationCard, /publication-card\.css/);
  assert.doesNotMatch(publicationCard, /CardDivider/);
  assert.doesNotMatch(publicationCard, /More details/);

  assert.match(authorList, /export const AuthorChipList/);
  assert.match(authorList, /data-publication-author-chip/);
  assert.match(authorList, /max-w-\[min\(24rem,100%\)\]/);
  assert.match(authorList, /overflowPlacement="pinned"/);
});

test('publication card stylesheet prevents footer overlap and divider treatment', () => {
  const publicationStyles = readProjectFile('src/styles/components/publication-card.css');

  assert.match(publicationStyles, /\.publication-card \.media-card__footer/);
  assert.match(publicationStyles, /border-top:\s*0/);
  assert.match(publicationStyles, /background:\s*transparent/);
  assert.match(publicationStyles, /padding-top:\s*clamp\(1rem,\s*1\.35vw,\s*1\.25rem\)/);
  assert.match(publicationStyles, /\.publication-card \.media-card__body/);
  assert.match(publicationStyles, /padding-bottom:\s*clamp\(1rem,\s*1\.4vw,\s*1\.35rem\)/);
  assert.match(publicationStyles, /grid-template-rows:\s*auto auto/);
  assert.match(publicationStyles, /align-self:\s*end/);
});

test('publication card keeps details affordance out of the resource footer', () => {
  const publicationCard = readProjectFile('src/components/ui/publication/PublicationCard.tsx');

  assert.match(publicationCard, /View details/);
  assert.match(publicationCard, /aria-label=\{`Open details for \$\{item\.title\}`\}/);
  assert.doesNotMatch(publicationCard, /Abstract, notes, and context/);
});
