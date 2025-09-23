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

  const readScrollState = () => (window.scrollY > 6 ? 'true' : 'false');

  const writeScrollState = (value: string) => {
    if (!nav) return;
    if (nav.dataset['scrolled'] !== value) {
      nav.dataset['scrolled'] = value;
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

    // Initial scroll state
    requestAnimationFrame(scheduleScrollUpdate);

    // Setup scroll handler
    window.addEventListener('scroll', scheduleScrollUpdate, { passive: true });
  };

  const cleanup = () => {
    window.removeEventListener('scroll', scheduleScrollUpdate);
    nav = null;
  };

  return { init, cleanup };
}
