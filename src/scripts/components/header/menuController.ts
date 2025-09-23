/**
 * Mobile menu management for header
 */

export interface MenuController {
  init(): void;
  cleanup(): void;
}

export function createMenuController(): MenuController {
  let isMenuOpen = false;

  // DOM element references
  let menu: HTMLElement | null = null;
  let overlay: HTMLElement | null = null;
  let toggle: HTMLElement | null = null;
  let sheet: HTMLElement | null = null;

  const setMenuOpen = (open: boolean) => {
    if (!menu || !toggle) return;

    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    toggle.dataset['open'] = open ? 'true' : 'false';

    // Toggle menu panel visibility
    if (open) {
      menu.classList.remove('opacity-0', 'pointer-events-none');
      menu.classList.add('opacity-100', 'pointer-events-auto');
    } else {
      menu.classList.add('opacity-0', 'pointer-events-none');
      menu.classList.remove('opacity-100', 'pointer-events-auto');
    }

    // Subtle slide for the sheet
    if (sheet) {
      if (open) {
        sheet.classList.remove('-translate-y-4', 'scale-[0.97]', 'opacity-0');
        sheet.classList.add('translate-y-0', 'scale-100', 'opacity-100');
      } else {
        sheet.classList.add('-translate-y-4', 'scale-[0.97]', 'opacity-0');
        sheet.classList.remove('translate-y-0', 'scale-100', 'opacity-100');
      }
    }

    // Toggle backdrop
    if (overlay) {
      if (open) {
        overlay.classList.remove('opacity-0', 'pointer-events-none');
        overlay.classList.add('opacity-100', 'pointer-events-auto');
      } else {
        overlay.classList.add('opacity-0', 'pointer-events-none');
        overlay.classList.remove('opacity-100', 'pointer-events-auto');
      }
    }

    // Lock scroll on open (mobile friendliness)
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
    if (element && element.tagName === 'A') {
      isMenuOpen = false;
      setMenuOpen(false);
    }
  };

  const handleBackdropClick = () => {
    isMenuOpen = false;
    setMenuOpen(false);
  };

  const init = () => {
    // Get DOM references
    menu = document.getElementById('mobile-menu');
    overlay = document.getElementById('mobile-menu-overlay');
    toggle = document.getElementById('menu-toggle');
    sheet = document.getElementById('mobile-menu-sheet');

    // Setup mobile menu
    if (toggle) {
      toggle.addEventListener('click', handleMenuToggle);
    }

    if (menu) {
      menu.addEventListener('click', handleMenuNavigation);
    }

    if (overlay) {
      overlay.addEventListener('click', handleBackdropClick);
    }
  };

  const cleanup = () => {
    // Remove event listeners
    if (toggle) {
      toggle.removeEventListener('click', handleMenuToggle);
    }

    if (menu) {
      menu.removeEventListener('click', handleMenuNavigation);
    }

    if (overlay) {
      overlay.removeEventListener('click', handleBackdropClick);
    }

    // Reset menu state
    if (isMenuOpen) {
      setMenuOpen(false);
      isMenuOpen = false;
    }

    // Clear references
    menu = null;
    overlay = null;
    toggle = null;
    sheet = null;
  };

  return { init, cleanup };
}
