import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const projectRoot = path.resolve(import.meta.dirname, '../../../..');

function readProjectFile(relativePath: string) {
  return readFileSync(path.join(projectRoot, relativePath), 'utf8');
}

test('shared card atoms expose measured one-row overflow behavior', () => {
  const cardAtoms = readProjectFile('src/components/ui/cards/CardAtoms.tsx');

  assert.match(cardAtoms, /CardMetaRow/);
  assert.match(cardAtoms, /CardMetaChip/);
  assert.match(cardAtoms, /ResizeObserver/);
  assert.match(cardAtoms, /useLayoutEffect/);
  assert.match(cardAtoms, /data-card-overflow-item/);
  assert.match(cardAtoms, /data-card-overflow-more/);
  assert.match(cardAtoms, /flex-nowrap/);
  assert.match(cardAtoms, /readonly maxVisible\?:\s*number/);
  assert.match(cardAtoms, /readonly minVisible\?:\s*number/);
  assert.match(cardAtoms, /readonly onOverflowClick\?:\s*(\(\(\)\s*=>\s*void\)|\(\)\s*=>\s*void)/);
  assert.match(cardAtoms, /readonly overflowLabel\?:\s*string/);
  assert.match(cardAtoms, /\+{hiddenCount}\s+more/);
});

test('media-led cards share a dialog surface for overflow metadata', () => {
  const dialogPath = 'src/components/ui/cards/CardDetailsDialog.tsx';
  const dialog = readProjectFile(dialogPath);
  const barrel = readProjectFile('src/components/ui/cards/index.ts');

  assert.equal(existsSync(path.join(projectRoot, dialogPath)), true);
  assert.match(dialog, /DialogContent/);
  assert.match(dialog, /DialogTitle/);
  assert.match(dialog, /DialogDescription/);
  assert.match(dialog, /readonly sections:/);
  assert.match(barrel, /CardDetailsDialog/);
});

test('project, talk, and publication cards cap visible metadata in collapsed cards', () => {
  const projectCard = readProjectFile('src/components/ui/cards/ProjectCard.tsx');
  const talkCard = readProjectFile('src/components/ui/cards/TalkCard.tsx');
  const publicationCard = readProjectFile('src/components/ui/publication/PublicationCard.tsx');
  const publicationActions = readProjectFile(
    'src/components/ui/publication/PublicationActions.tsx'
  );

  assert.match(projectCard, /CardDetailsDialog/);
  assert.match(projectCard, /CardMetaRow/);
  assert.match(projectCard, /CardMetaChip/);
  assert.match(projectCard, /maxVisible=\{featured \? 4 : 3\}/);
  assert.match(projectCard, /maxVisible=\{2\}/);
  assert.match(projectCard, /data-card-description/);

  assert.match(talkCard, /CardDetailsDialog/);
  assert.match(talkCard, /CardMetaRow/);
  assert.match(talkCard, /CardMetaChip/);
  assert.match(talkCard, /maxVisible=\{featured \? 4 : 3\}/);
  assert.match(talkCard, /maxVisible=\{2\}/);
  assert.match(talkCard, /data-card-description/);

  assert.match(publicationCard, /CardMetaRow/);
  assert.match(publicationCard, /maxVisible=\{featured \? 4 : 3\}/);
  assert.match(publicationCard, /data-card-description/);
  assert.match(publicationActions, /readonly maxVisible\?:\s*number/);
  assert.match(publicationActions, /MeasuredOverflowRow/);
  assert.match(publicationActions, /maxVisible=\{maxVisible\}/);
});

test('featured horizontal media cards remove divider lines only in wide layout', () => {
  const mediaCardStyles = readProjectFile('src/styles/components/media-card.css');
  const projectCardStyles = readProjectFile('src/styles/components/project-card.css');

  assert.match(mediaCardStyles, /@media \(min-width: 1024px\)/);
  assert.match(mediaCardStyles, /\.editorial-listing__featured \.media-card--featured/);
  assert.match(mediaCardStyles, /--media-card-horizontal-divider-display:\s*none/);
  assert.match(mediaCardStyles, /border-top:\s*0/);
  assert.match(projectCardStyles, /\.editorial-listing__featured \.project-card/);
  assert.match(projectCardStyles, /display:\s*none/);
});
