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
  assert.doesNotMatch(siteLogo, /site-logo-link[^']*shape-squircle-sm/);
  assert.doesNotMatch(siteLogo, /contain:\s*layout paint style/);

  assert.match(siteHeaderCss, /site-logo__title-text/);
  assert.match(siteHeaderCss, /clip-path:\s*inset\(0 100% 0 0\)/);
  assert.match(siteLogo, /border-radius:\s*var\(--site-logo-hover-radius/);
  assert.match(siteLogo, /background:\s*var\(\s*--site-logo-hover-bg/s);
  assert.match(siteHeaderCss, /--site-logo-radius:\s*999px/);
  assert.match(siteHeaderCss, /--site-logo-hover-radius:\s*var\(--nav-logo-expanded-radius/);
  assert.doesNotMatch(siteHeaderCss, /--site-logo-hover-clip/);
  assert.match(siteHeaderCss, /--nav-logo-expanded-blue/);
  assert.doesNotMatch(siteHeaderCss, /site-logo__halo\s*\{[^}]*opacity:\s*0\.16/s);
});
