import React, { memo, useEffect, useRef } from 'react';

const ReadingProgressBarComponent: React.FC = () => {
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const progressBar = progressBarRef.current;

    if (!progressBar || typeof window === 'undefined') return;

    let ticking = false;
    let docHeight = 0;

    const computeDocHeight = () => {
      const body = document.body;
      const html = document.documentElement;
      const full = Math.max(
        body.scrollHeight,
        html.scrollHeight,
        body.offsetHeight,
        html.offsetHeight,
        body.clientHeight,
        html.clientHeight
      );
      docHeight = Math.max(0, full - window.innerHeight);
    };

    const writeProgress = () => {
      const y = window.scrollY || document.documentElement.scrollTop || 0;
      const pct = docHeight > 0 ? Math.min((y / docHeight) * 100, 100) : 0;
      progressBar.style.width = `${pct}%`;
      ticking = false;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(writeProgress);
    };

    const onResize = () => {
      computeDocHeight();
      onScroll();
    };

    // Initial measure + paint
    computeDocHeight();
    requestAnimationFrame(writeProgress);

    // Listeners (throttled via rAF)
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('orientationchange', onResize, { passive: true });

    // Cleanup
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
    };
  }, []);

  return (
    <div
      ref={progressBarRef}
      className="fixed top-0 left-0 z-50 h-1 bg-[color:var(--accent)] transition-[width] duration-150 ease-out will-change-[width]"
      style={{ width: '0%' }}
      role="progressbar"
      aria-label="Reading progress"
    />
  );
};

const ReadingProgressBar = memo(ReadingProgressBarComponent);
ReadingProgressBar.displayName = 'ReadingProgressBar';

export default ReadingProgressBar;
export { ReadingProgressBar };
