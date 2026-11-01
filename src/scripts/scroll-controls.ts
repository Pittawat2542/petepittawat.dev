const button = document.querySelector<HTMLButtonElement>('[data-scroll-top]');
const progress = document.querySelector<HTMLElement>('[data-reading-progress]');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const nativeProgress = window.CSS.supports('animation-timeline', 'scroll()');
let frame = 0;

function update() {
  frame = 0;
  const y = Math.max(0, window.scrollY);
  if (button) {
    const visible = y > 200;
    button.dataset['visible'] = String(visible);
    button.inert = !visible;
    button.setAttribute('aria-hidden', String(!visible));
    button.style.opacity = visible ? '1' : '0';
    button.style.transform = visible ? 'translateY(0)' : 'translateY(0.5rem)';
    button.style.pointerEvents = visible ? 'auto' : 'none';
  }
  if (progress) {
    const height = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    const scrollable = Math.max(0, height - window.innerHeight);
    const fraction = scrollable ? Math.min(1, y / scrollable) : 0;
    progress.setAttribute('aria-valuenow', String(Math.round(fraction * 10000) / 100));
    if (!nativeProgress || reducedMotion.matches) {
      progress.style.transform = `scaleX(${fraction})`;
    }
  }
}
function scheduleUpdate() {
  if (!frame) frame = requestAnimationFrame(update);
}
button?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
});
window.addEventListener('scroll', scheduleUpdate, { passive: true });
window.addEventListener('resize', scheduleUpdate, { passive: true });
window.addEventListener('pageshow', scheduleUpdate);
reducedMotion.addEventListener('change', scheduleUpdate);
if (progress) {
  const observer = new ResizeObserver(scheduleUpdate);
  observer.observe(document.body);
  observer.observe(document.documentElement);
}
scheduleUpdate();
