import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const projectRoot = path.resolve(import.meta.dirname, '../../..');

function readProjectFile(relativePath: string) {
  return readFileSync(path.join(projectRoot, relativePath), 'utf8');
}

test('navbar logo reveal clips and animates the wordmark as its own text layer', () => {
  const siteLogo = readProjectFile('src/components/header/SiteLogo.astro');
  const siteHeaderCss = readProjectFile('src/styles/components/site-header.css');

  assert.match(siteLogo, /site-logo__title-text/);
  assert.match(siteLogo, /site-logo-link--reveal-title/);
  assert.match(siteLogo, /aria-label="Go to homepage"/);

  assert.match(siteHeaderCss, /site-logo__title-text/);
  assert.match(siteHeaderCss, /clip-path:\s*inset\(0 100% 0 0\)/);
  assert.match(
    siteHeaderCss,
    /\.site-header__brand-link \.site-logo\s*\{[^}]*border-radius:\s*999px/s
  );
  assert.match(
    siteHeaderCss,
    /\.site-header__brand-link\.site-logo-link--reveal-title:hover \.site-logo/s
  );
  assert.match(
    siteHeaderCss,
    /\.site-header__brand-link\.site-logo-link--reveal-title:hover \.site-logo[^}]*border-radius:\s*0\.72rem/s
  );
  assert.match(
    siteHeaderCss,
    /\.site-header__brand-link\.site-logo-link--reveal-title:hover \.site-logo[^}]*--expanded-logo-blue/s
  );
  assert.doesNotMatch(siteHeaderCss, /site-logo__halo\s*\{[^}]*opacity:\s*0\.16/s);
});
