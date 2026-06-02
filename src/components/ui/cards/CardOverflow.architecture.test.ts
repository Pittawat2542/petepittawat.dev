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
  const cardMeta = readProjectFile('src/components/ui/cards/CardMeta.tsx');
  const measuredOverflowRow = readProjectFile('src/components/ui/cards/MeasuredOverflowRow.tsx');
  const cardTagList = readProjectFile('src/components/ui/cards/CardTagList.tsx');

  assert.match(cardAtoms, /CardMetaRow/);
  assert.match(cardAtoms, /CardMetaChip/);
  assert.match(cardMeta, /flex-wrap items-center gap-2 overflow-visible/);
  assert.match(measuredOverflowRow, /ResizeObserver/);
  assert.match(measuredOverflowRow, /useLayoutEffect/);
  assert.match(measuredOverflowRow, /data-card-overflow-item/);
  assert.match(measuredOverflowRow, /data-card-overflow-more/);
  assert.match(measuredOverflowRow, /pointer-events-none invisible fixed/);
  assert.match(measuredOverflowRow, /flex-nowrap/);
  assert.match(measuredOverflowRow, /readonly maxVisible\?:\s*number/);
  assert.match(measuredOverflowRow, /readonly minVisible\?:\s*number/);
  assert.match(measuredOverflowRow, /readonly overflowPlacement\?:\s*'inline'\s*\|\s*'pinned'/);
  assert.match(measuredOverflowRow, /readonly viewportSafe\?:\s*boolean/);
  assert.match(measuredOverflowRow, /useState\(floorCount\)/);
  assert.match(measuredOverflowRow, /setVisibleCount\(floorCount\)/);
  assert.match(measuredOverflowRow, /overflowPlacement = 'inline'/);
  assert.match(measuredOverflowRow, /grid-cols-\[minmax\(0,1fr\)_auto\]/);
  assert.match(measuredOverflowRow, /data-card-overflow-track/);
  assert.match(measuredOverflowRow, /enforceRenderedFit/);
  assert.match(measuredOverflowRow, /document\.fonts\.ready/);
  assert.match(measuredOverflowRow, /data-card-overflow-item[\s\S]*shrink-0/);
  assert.match(
    cardTagList,
    /readonly onOverflowClick\?:\s*(\(\(\)\s*=>\s*void\)|\(\)\s*=>\s*void)/
  );
  assert.match(cardTagList, /readonly overflowLabel\?:\s*string/);
  assert.match(cardTagList, /\+{hiddenCount}\s+more/);
});

test('editorial listing items leave hover ink unclipped', () => {
  const explorer = readProjectFile('src/components/explorers/EditorialExplorer.tsx');
  const listingStyles = readProjectFile('src/styles/components/editorial-listing.layout.css');

  assert.doesNotMatch(explorer, /editorial-listing__item[^\n]*content-visibility:auto/);
  assert.doesNotMatch(explorer, /editorial-listing__item[^\n]*contain-intrinsic-size/);
  assert.match(listingStyles, /\.editorial-listing__item\s*\{[\s\S]*margin:\s*-0\.85rem/);
  assert.match(listingStyles, /\.editorial-listing__item\s*\{[\s\S]*padding:\s*0\.85rem/);
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
  const authorList = readProjectFile('src/components/ui/publication/AuthorList.tsx');
  const cardTagList = readProjectFile('src/components/ui/cards/CardTagList.tsx');
  const publicationStyles = readProjectFile('src/styles/components/publication-card.css');

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
  assert.doesNotMatch(publicationCard, /CardMetaChip\s+icon=\{Building2\}/);
  assert.doesNotMatch(publicationCard, /CardDivider/);
  assert.match(publicationCard, /publication-card\.css/);
  assert.match(publicationCard, /AuthorChipList/);
  assert.match(publicationCard, /maxVisible=\{featured \? 4 : 3\}/);
  assert.match(publicationActions, /readonly maxVisible\?:\s*number/);
  assert.match(publicationActions, /MeasuredOverflowRow/);
  assert.match(publicationActions, /maxVisible=\{maxVisible\}/);
  assert.match(authorList, /AuthorChipList/);
  assert.match(authorList, /MeasuredOverflowRow/);
  assert.match(authorList, /overflowPlacement="pinned"/);
  assert.match(authorList, /readonly onOverflowClick\?:\s*\(\)\s*=>\s*void/);
  assert.match(authorList, /\+{hiddenCount}\s+more/);
  assert.match(cardTagList, /overflowPlacement="pinned"/);
  assert.match(publicationStyles, /\.publication-card \.media-card__footer/);
  assert.match(publicationStyles, /border-top:\s*0/);
  assert.match(publicationStyles, /background:\s*transparent/);
  assert.match(
    publicationStyles,
    /\.editorial-listing__featured \.media-card--featured\.publication-card/
  );
  assert.match(publicationStyles, /grid-template-rows:\s*auto auto/);
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
