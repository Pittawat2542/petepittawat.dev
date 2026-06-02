function revealAll(elements: NodeListOf<Element>) {
  elements.forEach(element => {
    element.classList.add('reveal-visible');
  });
}

function initReveal() {
  const elements = document.querySelectorAll('.reveal:not(.reveal-visible)');
  if (elements.length === 0) return;

  if (
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    typeof IntersectionObserver === 'undefined'
  ) {
    revealAll(elements);
    return;
  }

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        requestAnimationFrame(() => {
          entry.target.classList.add('reveal-visible');
        });
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: '0px 0px -5% 0px', threshold: 0.05 }
  );

  elements.forEach(element => {
    observer.observe(element);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener(
    'DOMContentLoaded',
    () => {
      requestAnimationFrame(initReveal);
    },
    { once: true }
  );
} else {
  requestAnimationFrame(initReveal);
}
