import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const projectRoot = path.resolve(import.meta.dirname, '../../../..');

function readProjectFile(relativePath: string) {
  return readFileSync(path.join(projectRoot, relativePath), 'utf8');
}

test('media content card shell owns the shared media-led card contract', () => {
  const shellPath = 'src/components/ui/cards/MediaContentCard.tsx';
  const shell = readProjectFile(shellPath);
  const tokens = readProjectFile('src/styles/tokens.css');

  assert.equal(existsSync(path.join(projectRoot, shellPath)), true);
  assert.match(shell, /interface MediaContentCardProps/);
  assert.match(shell, /readonly media:\s*ReactNode/);
  assert.match(shell, /readonly mediaBadges\?:\s*ReactNode/);
  assert.match(shell, /readonly footer\?:\s*ReactNode/);
  assert.match(shell, /createAccentStyle\(accent\)/);
  assert.match(shell, /media-card__media/);
  assert.match(shell, /media-card__body/);
  assert.match(shell, /media-card__footer/);

  assert.match(tokens, /--media-card-radius:/);
  assert.match(tokens, /--media-card-surface:/);
  assert.match(tokens, /--media-card-border:/);
  assert.match(tokens, /--media-card-hover-border:/);
  assert.match(tokens, /--media-card-shadow:/);
  assert.match(tokens, /--media-card-focus-ring:/);
  assert.match(tokens, /--media-card-media-aspect:/);
  assert.match(tokens, /--media-card-padding:/);
  assert.match(tokens, /--media-card-footer-surface:/);
  assert.match(tokens, /--media-card-muted:/);
});

test('content cards use the media content shell instead of owning duplicated card chrome', () => {
  const blogCard = readProjectFile('src/components/ui/cards/BlogCard.tsx');
  const projectCard = readProjectFile('src/components/ui/cards/ProjectCard.tsx');
  const publicationCard = readProjectFile('src/components/ui/publication/PublicationCard.tsx');
  const talkCard = readProjectFile('src/components/ui/cards/TalkCard.tsx');
  const barrel = readProjectFile('src/components/ui/cards/index.ts');

  assert.match(barrel, /MediaContentCard/);
  assert.match(blogCard, /MediaContentCard/);
  assert.match(projectCard, /MediaContentCard/);
  assert.match(publicationCard, /MediaContentCard/);
  assert.match(talkCard, /MediaContentCard/);

  assert.match(blogCard, /mediaBadges=/);
  assert.match(blogCard, /BlogCardImage/);
  assert.doesNotMatch(blogCard, /aurora-card__body flex flex-1 flex-col/);
  assert.doesNotMatch(projectCard, /AuroraCardShell/);
  assert.doesNotMatch(publicationCard, /AuroraCardShell/);
  assert.doesNotMatch(talkCard, /AuroraCardShell/);
});
