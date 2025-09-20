/**
 * Header script functionality
 * Handles scroll state, mobile menu, and search initialization
 */

export interface HeaderController {
  init(): void;
  cleanup(): void;
}

export function createHeaderController(): HeaderController {
  let isInitialized = false;
  let scrollTicking = false;
  let isMenuOpen = false;

  // DOM element references
  let nav: HTMLElement | null = null;
  let menu: HTMLElement | null = null;
  let overlay: HTMLElement | null = null;
  let toggle: HTMLElement | null = null;
  let sheet: HTMLElement | null = null;
  let iconOpen: HTMLElement | null = null;
  let iconClose: HTMLElement | null = null;

  const readScrollState = () => (window.scrollY > 6 ? 'true' : 'false');
  
  const writeScrollState = (value: string) => {
    if (!nav) return;
    if (nav.dataset.scrolled !== value) {
      nav.dataset.scrolled = value;
    }
  };

  const scheduleScrollUpdate = () => {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(() => {
      const value = readScrollState();
      writeScrollState(value);
      scrollTicking = false;
    });
  };

  const setMenuOpen = (open: boolean) => {
    if (!menu || !toggle) return;
    
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    
    // Toggle icons
    if (iconOpen && iconClose) {
      if (open) {
        iconOpen.classList.add('hidden');
        iconClose.classList.remove('hidden');
      } else {
        iconOpen.classList.remove('hidden');
        iconClose.classList.add('hidden');
      }
    }
    
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
        sheet.classList.remove('-translate-y-2');
        sheet.classList.add('translate-y-0');
      } else {
        sheet.classList.add('-translate-y-2');
        sheet.classList.remove('translate-y-0');
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
    const element = (target instanceof Element) ? target.closest('a') : null;
    if (element && element.tagName === 'A') {
      isMenuOpen = false;
      setMenuOpen(false);
    }
  };

  const handleBackdropClick = () => {
    isMenuOpen = false;
    setMenuOpen(false);
  };

  const setupSearch = () => {
    let prefetched = false;
    
    const prefetchSearchIndex = () => {
      if (prefetched) return;
      prefetched = true;
      
      try {
        // Respect Data Saver
        // @ts-ignore
        if (navigator?.connection?.saveData) return;
      } catch {}
      
      fetch('/search.json').catch(() => {});
    };

    const openSearchLazy = async () => {
      try {
        const module = await import('../openSearch');
        module.openSearch();
      } catch (e) {
        console.warn('Failed to open search modal', e);
      }
    };

    // Find search triggers
    const desktopButton = document.getElementById('open-search-desktop');
    const mobileButton = document.getElementById('open-search-mobile');
    const drawerButton = document.getElementById('open-search-drawer');
    
    if (!desktopButton || !mobileButton || !drawerButton) {
      // Retry after a short delay if elements aren't ready
      setTimeout(setupSearch, 100);
      return;
    }

    // Prefetch on pointer/focus intent
    const triggers = document.querySelectorAll('button[aria-label="Open search"]');
    triggers.forEach((trigger) => {
      trigger.addEventListener('mouseenter', prefetchSearchIndex, { once: true, passive: true });
      trigger.addEventListener('focus', prefetchSearchIndex, { once: true });
      trigger.addEventListener('touchstart', prefetchSearchIndex, { once: true, passive: true });
    });

    // Click handlers
    desktopButton.addEventListener('click', openSearchLazy);
    mobileButton.addEventListener('click', openSearchLazy);
    drawerButton.addEventListener('click', openSearchLazy);

    // Keyboard shortcut
    const handleKeydown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        prefetchSearchIndex();
        openSearchLazy();
      }
    };

    window.addEventListener('keydown', handleKeydown);

    // Return cleanup function
    return () => {
      desktopButton?.removeEventListener('click', openSearchLazy);
      mobileButton?.removeEventListener('click', openSearchLazy);
      drawerButton?.removeEventListener('click', openSearchLazy);
      window.removeEventListener('keydown', handleKeydown);
    };
  };

  const init = () => {
    if (isInitialized) return;
    
    // Get DOM references
    nav = document.getElementById('site-nav');
    menu = document.getElementById('mobile-menu');
    overlay = document.getElementById('mobile-menu-overlay');
    toggle = document.getElementById('menu-toggle');
    sheet = document.getElementById('mobile-menu-sheet');
    iconOpen = document.getElementById('menu-icon-open');
    iconClose = document.getElementById('menu-icon-close');

    // Initial scroll state
    requestAnimationFrame(scheduleScrollUpdate);
    
    // Setup scroll handler
    window.addEventListener('scroll', scheduleScrollUpdate, { passive: true });

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

    // Setup search
    setupSearch();

    isInitialized = true;
  };

  const cleanup = () => {
    if (!isInitialized) return;
    
    // Remove event listeners
    window.removeEventListener('scroll', scheduleScrollUpdate);
    
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
    nav = null;
    menu = null;
    overlay = null;
    toggle = null;
    sheet = null;
    iconOpen = null;
    iconClose = null;

    isInitialized = false;
  };

  return {
    init,
    cleanup
  };
}

// Auto-initialize when DOM is ready
let headerController: HeaderController | null = null;

function initializeHeader() {
  if (headerController) return;
  
  headerController = createHeaderController();
  headerController.init();
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeHeader, { once: true });
} else {
  initializeHeader();
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  if (headerController) {
    headerController.cleanup();
    headerController = null;
  }
});