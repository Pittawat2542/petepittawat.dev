import { SEARCH_OPEN_EVENT } from '@/scripts/openSearch';

export interface MenuController {
  init(): void;
  cleanup(): void;
}

export function createMenuController(): MenuController {
  const desktopBreakpoint = window.matchMedia('(min-width: 960px)');
  const menu = document.getElementById('mobile-menu');
  const toggle = document.getElementById('menu-toggle');
  const sheet = document.getElementById('mobile-menu-sheet');
  const links = Array.from(menu?.querySelectorAll<HTMLAnchorElement>('a[href]') ?? []);
  const inactiveBackground = new Set<HTMLElement>();
  const root = document.documentElement;
  let isOpen = false;
  let previousOverflow = '';
  let lastFocusedLink: HTMLAnchorElement | undefined;

  function close(focusTarget?: HTMLElement | null) {
    if (!isOpen || !menu || !toggle) return;
    isOpen = false;
    inactiveBackground.forEach(element => {
      element.inert = false;
    });
    inactiveBackground.clear();
    root.style.overflow = previousOverflow;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
    toggle.dataset['open'] = 'false';
    focusTarget?.focus({ preventScroll: true });
    menu.dataset['open'] = 'false';
    menu.inert = true;
    menu.setAttribute('aria-hidden', 'true');
    if (sheet) sheet.dataset['open'] = 'false';
    lastFocusedLink = undefined;
  }

  function handleToggle() {
    if (!menu || !toggle) return;
    if (isOpen) {
      close(toggle);
      return;
    }
    if (desktopBreakpoint.matches) return;

    isOpen = true;
    previousOverflow = root.style.overflow;
    root.style.overflow = 'hidden';
    for (const element of document.querySelectorAll<HTMLElement>(
      'body > :is(main, footer, .skip-link, [data-scroll-top])'
    )) {
      if (element.inert) continue;
      element.inert = true;
      inactiveBackground.add(element);
    }
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close menu');
    toggle.dataset['open'] = 'true';
    menu.dataset['open'] = 'true';
    menu.removeAttribute('aria-hidden');
    menu.inert = false;
    if (sheet) sheet.dataset['open'] = 'true';
    links[0]?.focus();
  }

  function handleNavigation(event: MouseEvent) {
    if (event.target instanceof Element && event.target.closest('a')) close(toggle);
  }

  function handleFocus(event: FocusEvent) {
    if (event.target instanceof HTMLAnchorElement) lastFocusedLink = event.target;
  }

  function handleKeydown(event: KeyboardEvent) {
    if (!isOpen || !toggle) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      close(toggle);
      return;
    }
    if (event.key !== 'Tab') return;

    const items = [toggle, ...links];
    const index = items.findIndex(item => item === document.activeElement);
    const step = event.shiftKey ? -1 : 1;
    event.preventDefault();
    items[(index + step + items.length) % items.length]?.focus();
  }

  function handleDesktopBreakpoint(event: MediaQueryListEvent) {
    if (!event.matches || !isOpen) return;
    const desktopLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('#nav-list a'));
    const matchingLink = desktopLinks.find(link => link.href === lastFocusedLink?.href);
    close(matchingLink ?? desktopLinks[0]);
  }

  function handleOpenSearch() {
    close(menu?.contains(document.activeElement) ? toggle : undefined);
  }

  return {
    init() {
      toggle?.addEventListener('click', handleToggle);
      menu?.addEventListener('click', handleNavigation);
      menu?.addEventListener('focusin', handleFocus);
      document.addEventListener('keydown', handleKeydown);
      desktopBreakpoint.addEventListener('change', handleDesktopBreakpoint);
      window.addEventListener(SEARCH_OPEN_EVENT, handleOpenSearch);
    },
    cleanup() {
      toggle?.removeEventListener('click', handleToggle);
      menu?.removeEventListener('click', handleNavigation);
      menu?.removeEventListener('focusin', handleFocus);
      document.removeEventListener('keydown', handleKeydown);
      desktopBreakpoint.removeEventListener('change', handleDesktopBreakpoint);
      window.removeEventListener(SEARCH_OPEN_EVENT, handleOpenSearch);
      close();
    },
  };
}
