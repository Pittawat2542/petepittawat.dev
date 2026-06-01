import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const projectRoot = path.resolve(import.meta.dirname, '../../../..');

function readProjectFile(relativePath: string) {
  return readFileSync(path.join(projectRoot, relativePath), 'utf8');
}

test('publication modal keeps title and resources outside the scroll pane', () => {
  const modal = readProjectFile('src/components/ui/publication/PublicationModal.tsx');
  const authorList = readProjectFile('src/components/ui/publication/AuthorList.tsx');

  assert.match(modal, /<header className="publication-modal__header">/);
  assert.match(modal, /<div className="publication-modal__scroll" role="document">/);
  assert.match(modal, /<div className="publication-modal__meta">/);
  assert.match(modal, /AuthorChipCloud/);
  assert.match(modal, /className="publication-modal__authors"/);
  assert.doesNotMatch(modal, /<AuthorList/);
  assert.match(authorList, /export const AuthorChipCloud/);
  assert.match(authorList, /aria-label="Authors"/);
  assert.match(modal, /<section className="publication-modal__section">/);
  assert.match(modal, /<footer className="publication-modal__resource-bar"/);
  assert.match(modal, /aria-label="Publication resources"/);
  assert.doesNotMatch(modal, /publication-modal__section--resources/);
});

test('publication modal stylesheet fixes chrome while scrolling content', () => {
  const styles = readProjectFile('src/styles/global.css');

  assert.match(styles, /\.publication-modal__header\s*\{[\s\S]*flex:\s*0 0 auto/);
  assert.match(styles, /\.publication-modal__scroll\s*\{[\s\S]*flex:\s*1 1 auto/);
  assert.match(styles, /\.publication-modal__scroll\s*\{[\s\S]*overflow-y:\s*auto/);
  assert.match(styles, /\.publication-modal__scroll\s*\{[\s\S]*padding-top:\s*0\.25rem/);
  assert.match(styles, /\.publication-modal__authors\s*\{[\s\S]*margin-block:\s*0/);
  assert.match(styles, /\.publication-modal__resource-bar\s*\{[\s\S]*flex:\s*0 0 auto/);
  assert.match(styles, /\.publication-modal__resource-bar\s*\{[\s\S]*z-index:\s*10/);
});
