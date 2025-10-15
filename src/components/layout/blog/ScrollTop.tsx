import { memo, useEffect, useRef, type FC } from 'react';
import { ArrowUp } from 'lucide-react';

const ScrollTopComponent: FC = () => {
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const btn = btnRef.current;
    if (!btn) return;

    let ticking = false;

    function updateScrollButton() {
      if (!btn) return;

      const scrollY =
        window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
      const show = scrollY > 200;

      if (show) {
        btn.setAttribute('data-visible', 'true');
        btn.style.opacity = '1';
        btn.style.transform = 'translateY(0)';
        btn.style.pointerEvents = 'auto';
      } else {
        btn.setAttribute('data-visible', 'false');
        btn.style.opacity = '0';
        btn.style.transform = 'translateY(0.5rem)';
        btn.style.pointerEvents = 'none';
      }

      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(updateScrollButton);
        ticking = true;
      }
    }

    function scrollToTop() {
      if ('scrollTo' in window) {
        try {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        } catch (e) {
          // Fallback
        }
      }

      const start =
        window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
      const duration = 300;
      let startTime: number | null = null;

      function animateScroll(currentTime: number) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);

        const ease = 1 - Math.pow(1 - progress, 3);
        const position = start * (1 - ease);

        window.scrollTo(0, position);

        if (progress < 1) {
          requestAnimationFrame(animateScroll);
        }
      }

      requestAnimationFrame(animateScroll);
    }

    const handleOrientationChange = () => {
      setTimeout(onScroll, 100);
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        setTimeout(updateScrollButton, 50);
      }
    };

    // Event listeners
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('orientationchange', handleOrientationChange, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    btn.addEventListener('click', scrollToTop);

    if ('visibilitychange' in document) {
      document.addEventListener('visibilitychange', handleVisibilityChange);
    }

    // Initial call
    setTimeout(updateScrollButton, 100);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('resize', onScroll);
      btn.removeEventListener('click', scrollToTop);
      if ('visibilitychange' in document) {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      }
    };
  }, []);

  return (
    <button
      ref={btnRef}
      aria-label="Back to top"
      title="Scroll to top"
      className="glass-button bg-muted/20 border-muted/40 hover:bg-muted/30 hover:border-muted/60 pointer-events-none fixed right-6 bottom-6 z-30 inline-flex h-11 w-11 translate-y-2 items-center justify-center rounded-full text-[color:var(--white)] opacity-0 shadow-md shadow-black/10 transition-[opacity,transform,box-shadow,color,background-color,border-color] duration-200 ease-out will-change-transform hover:text-[color:var(--accent)] active:scale-[0.98]"
      style={{
        right: 'max(1.25rem, env(safe-area-inset-right))',
        bottom: 'max(1.25rem, env(safe-area-inset-bottom))',
      }}
      data-visible="false"
    >
      <ArrowUp className="h-5 w-5" aria-hidden="true" />
    </button>
  );
};

const ScrollTop = memo(ScrollTopComponent);
ScrollTop.displayName = 'ScrollTop';

export default ScrollTop;
export { ScrollTop };
