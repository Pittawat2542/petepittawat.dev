/**
 * Scroll state management for header
 */

export interface ScrollController {
  init(): void;
  cleanup(): void;
}

export function createScrollController(): ScrollController {
  let scrollTicking = false;
  let nav: HTMLElement | null = null;
  let shell: HTMLElement | null = null;

  const readScrollState = () => (window.scrollY > 6 ? 'true' : 'false');

  const writeScrollState = (value: string) => {
    if (nav && nav.dataset['scrolled'] !== value) {
      nav.dataset['scrolled'] = value;
    }
    if (shell && shell.dataset['scrolled'] !== value) {
      shell.dataset['scrolled'] = value;
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

  const init = () => {
    nav = document.getElementById('site-nav');
    shell = document.getElementById('site-nav-shell');

    // Initial scroll state
    requestAnimationFrame(scheduleScrollUpdate);

    // Setup scroll handler
    window.addEventListener('scroll', scheduleScrollUpdate, { passive: true });
  };

  const cleanup = () => {
    window.removeEventListener('scroll', scheduleScrollUpdate);
    nav = null;
    shell = null;
  };

  return { init, cleanup };
}
