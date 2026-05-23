/**
 * Mobile menu management for header
 */

export interface MenuController {
  init(): void;
  cleanup(): void;
}

export function createMenuController(): MenuController {
  let isMenuOpen = false;
  const desktopBreakpoint = window.matchMedia('(min-width: 960px)');

  // DOM element references
  let menu: HTMLElement | null = null;
  let toggle: HTMLElement | null = null;
  let sheet: HTMLElement | null = null;

  const setMenuOpen = (open: boolean) => {
    if (!menu || !toggle) return;

    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    toggle.dataset['open'] = open ? 'true' : 'false';

    menu.dataset['open'] = open ? 'true' : 'false';
    menu.setAttribute('aria-hidden', open ? 'false' : 'true');
    menu.inert = !open;
    menu.toggleAttribute('inert', !open);
    menu.style.opacity = open ? '1' : '0';
    menu.style.pointerEvents = open ? 'auto' : 'none';

    if (sheet) {
      sheet.dataset['open'] = open ? 'true' : 'false';
      sheet.style.opacity = open ? '1' : '0';
      sheet.style.transform = open ? 'translateY(0)' : 'translateY(-0.35rem)';
    }

    const root = document.documentElement;
    if (open) {
      root.style.overflow = 'hidden';
    } else {
      root.style.overflow = '';
    }
  };

  const handleMenuToggle = () => {
    isMenuOpen = !isMenuOpen;
    setMenuOpen(isMenuOpen);
  };

  const handleMenuNavigation = (e: Event) => {
    const target = e.target;
    const element = target instanceof Element ? target.closest('a') : null;
    if (element?.tagName === 'A') {
      isMenuOpen = false;
      setMenuOpen(false);
    }
  };

  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key !== 'Escape' || !isMenuOpen) return;

    isMenuOpen = false;
    setMenuOpen(false);
    toggle?.focus();
  };

  const handleDesktopBreakpoint = (event: MediaQueryListEvent) => {
    if (!event.matches || !isMenuOpen) return;

    isMenuOpen = false;
    setMenuOpen(false);
  };

  const init = () => {
    // Get DOM references
    menu = document.getElementById('mobile-menu');
    toggle = document.getElementById('menu-toggle');
    sheet = document.getElementById('mobile-menu-sheet');

    // Setup mobile menu
    if (toggle) {
      toggle.addEventListener('click', handleMenuToggle);
    }

    if (menu) {
      menu.addEventListener('click', handleMenuNavigation);
    }

    setMenuOpen(false);
    document.addEventListener('keydown', handleKeydown);
    desktopBreakpoint.addEventListener('change', handleDesktopBreakpoint);
  };

  const cleanup = () => {
    // Remove event listeners
    if (toggle) {
      toggle.removeEventListener('click', handleMenuToggle);
    }

    if (menu) {
      menu.removeEventListener('click', handleMenuNavigation);
    }

    document.removeEventListener('keydown', handleKeydown);
    desktopBreakpoint.removeEventListener('change', handleDesktopBreakpoint);

    // Reset menu state
    if (isMenuOpen) {
      setMenuOpen(false);
      isMenuOpen = false;
    }

    // Clear references
    menu = null;
    toggle = null;
    sheet = null;
  };

  return { init, cleanup };
}
