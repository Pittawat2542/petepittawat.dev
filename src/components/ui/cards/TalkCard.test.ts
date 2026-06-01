import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const projectRoot = path.resolve(import.meta.dirname, '../../../..');

function readProjectFile(relativePath: string) {
  return readFileSync(path.join(projectRoot, relativePath), 'utf8');
}

test('talk card root opens details as a keyboard-accessible dialog trigger', () => {
  const talkCard = readProjectFile('src/components/ui/cards/TalkCard.tsx');

  assert.match(talkCard, /className=\{cn\(/);
  assert.match(talkCard, /'talk-card h-full/);
  assert.match(talkCard, /role="button"/);
  assert.match(talkCard, /tabIndex=\{0\}/);
  assert.match(talkCard, /onClick=\{openDetails\}/);
  assert.match(talkCard, /onKeyDown=\{onCardKeyDown\}/);
  assert.match(talkCard, /aria-haspopup="dialog"/);
  assert.match(talkCard, /aria-expanded=\{detailsOpen\}/);
  assert.match(talkCard, /aria-controls=\{detailsId\}/);
  assert.match(talkCard, /event\.key === 'Enter' \|\| event\.key === ' '/);
});

test('talk card keeps nested direct actions from bubbling to the card trigger', () => {
  const talkCard = readProjectFile('src/components/ui/cards/TalkCard.tsx');
  const cardAtoms = readProjectFile('src/components/ui/cards/CardAtoms.tsx');

  assert.match(talkCard, /const stopCardClick = \(event: ReactMouseEvent<HTMLElement>\)/);
  assert.match(talkCard, /event\.stopPropagation\(\)/);
  assert.match(talkCard, /onClick=\{stopCardClick\}/);
  assert.match(talkCard, /renderTalkResources\(resources, tint, stopCardClick\)/);
  assert.match(talkCard, /event\.stopPropagation\(\);\s*setDetailsOpen\(true\)/);
  assert.match(cardAtoms, /event\.stopPropagation\(\);\s*onOverflowClick\(\)/);
});

test('talk card imports scoped styles and mirrors publication viewport-safe layout fixes', () => {
  const talkCard = readProjectFile('src/components/ui/cards/TalkCard.tsx');
  const talkStylesPath = 'src/styles/components/talk-card.css';
  const talkStyles = readProjectFile(talkStylesPath);

  assert.equal(existsSync(path.join(projectRoot, talkStylesPath)), true);
  assert.match(talkCard, /talk-card\.css/);
  assert.doesNotMatch(talkCard, /CardDivider/);
  assert.match(talkCard, /cardViewportRowClassName/);
  assert.match(talkCard, /<CardMetaRow viewportSafe=\{featured\}/);
  assert.match(talkCard, /viewportSafe=\{featured\}/);
  assert.match(talkCard, /className=\{cardViewportRowClassName\}/);
  assert.match(talkStyles, /\.talk-card \.media-card__footer/);
  assert.match(talkStyles, /border-top:\s*0/);
  assert.match(talkStyles, /background:\s*transparent/);
  assert.match(talkStyles, /padding-top:\s*clamp\(1rem,\s*1\.35vw,\s*1\.25rem\)/);
  assert.match(talkStyles, /\.talk-card \.media-card__body/);
  assert.match(talkStyles, /padding-bottom:\s*clamp\(1rem,\s*1\.4vw,\s*1\.35rem\)/);
  assert.match(talkStyles, /\.editorial-listing__featured \.media-card--featured\.talk-card/);
  assert.match(talkStyles, /grid-template-rows:\s*auto auto/);
  assert.match(talkStyles, /align-self:\s*end/);
});

test('talk details dialog is always rendered with event context and content id wiring', () => {
  const talkCard = readProjectFile('src/components/ui/cards/TalkCard.tsx');
  const dialog = readProjectFile('src/components/ui/cards/CardDetailsDialog.tsx');

  assert.match(talkCard, /title: 'Event context'/);
  assert.match(talkCard, /title: 'Tags'/);
  assert.match(talkCard, /title: 'Resources'/);
  assert.match(talkCard, /contentId=\{detailsId\}/);
  assert.doesNotMatch(talkCard, /hasHiddenMetadata/);
  assert.match(dialog, /readonly contentId\?:\s*string/);
  assert.match(dialog, /id=\{contentId\}/);
});

test('talk card omits the resource footer when no public resources exist', () => {
  const talkCard = readProjectFile('src/components/ui/cards/TalkCard.tsx');

  assert.doesNotMatch(talkCard, /Session archive/);
  assert.doesNotMatch(talkCard, /No public resources are linked for this talk\./);
  assert.match(talkCard, /footer=\{\s*hasResources \? \(/);
  assert.match(talkCard, /\)\s*:\s*null\s*\}\s*>/);
});

test('talk card adds bottom breathing room when resources are omitted', () => {
  const talkCard = readProjectFile('src/components/ui/cards/TalkCard.tsx');
  const talkStyles = readProjectFile('src/styles/components/talk-card.css');

  assert.match(talkCard, /!hasResources && 'talk-card--no-resources'/);
  assert.match(talkStyles, /\.talk-card--no-resources \.media-card__body/);
  assert.match(talkStyles, /padding-bottom:\s*clamp\(2rem,\s*6vw,\s*2\.75rem\)/);
});
