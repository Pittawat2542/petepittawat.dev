import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const projectRoot = path.resolve(import.meta.dirname, '../../..');

function readProjectFile(relativePath: string) {
  return readFileSync(path.join(projectRoot, relativePath), 'utf8');
}

test('mobile menu is a full-width simple nav panel', () => {
  const mobileMenu = readProjectFile('src/components/header/MobileMenu.astro');
  const menuController = readProjectFile('src/scripts/components/header/menuController.ts');

  assert.match(mobileMenu, /aria-label="Mobile primary navigation"/);
  assert.match(mobileMenu, /aria-hidden="true"/);
  assert.match(mobileMenu, /\binert\b/);
  assert.match(
    mobileMenu,
    /min-height:\s*calc\(100dvh - \(env\(safe-area-inset-top\) \+ var\(--nav-height\)\)\)/
  );
  assert.match(mobileMenu, /background:\s*var\(--nav-bg-scrolled\)/);
  assert.match(
    mobileMenu,
    /backdrop-filter:\s*blur\(var\(--nav-blur-scrolled\)\) saturate\(150%\)/
  );
  assert.match(mobileMenu, /--nav-active-rule/);
  assert.match(mobileMenu, /aria-current=\{isActive\(href\) \? 'page' : undefined\}/);
  assert.match(
    mobileMenu,
    /\.mobile-menu-panel__list li:first-child \.mobile-menu-link::before\s*\{[^}]*content:\s*none/s
  );
  assert.match(
    mobileMenu,
    /\.mobile-menu-link--active::after,[^{]*\.mobile-menu-link--active::after\s*\{[^}]*height:\s*var\(--nav-active-rule-height\)/s
  );
  assert.doesNotMatch(mobileMenu, /\.mobile-menu-link--active \.mobile-menu-link__label::after/);

  assert.doesNotMatch(mobileMenu, /description:/);
  assert.doesNotMatch(mobileMenu, /mobile-menu-link__description/);
  assert.doesNotMatch(mobileMenu, /mobile-menu-link__badge/);
  assert.doesNotMatch(mobileMenu, /mobile-menu-link__chevron/);
  assert.doesNotMatch(mobileMenu, /ChevronRight/);
  assert.doesNotMatch(mobileMenu, /tabindex=\{isActive/);
  assert.doesNotMatch(mobileMenu, /pointer-events:\s*none;\s*border-color/s);

  assert.match(menuController, /translateY\(0\)/);
  assert.match(menuController, /translateY\(-0\.35rem\)/);
  assert.match(menuController, /menu\.inert\s*=\s*!open/);
  assert.match(menuController, /menu\.toggleAttribute\('inert',\s*!open\)/);
  assert.match(menuController, /menu\.setAttribute\('aria-hidden',\s*open \? 'false' : 'true'\)/);
  assert.doesNotMatch(menuController, /mobile-menu-overlay/);
});
