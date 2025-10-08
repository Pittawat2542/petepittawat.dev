import type { CSSProperties, FC, ReactNode } from 'react';
import { memo, useEffect, useMemo, useRef } from 'react';

import { cn } from '@/lib/utils';
import { COMPONENT_CONFIG } from '../../../lib/constants';

interface RevealProps {
  readonly children: ReactNode;
  readonly className?: string;
  readonly delayMs?: number;
  readonly id?: string;
  readonly style?: CSSProperties;
}

const RevealComponent: FC<RevealProps> = ({ children, className, delayMs, id, style }) => {
  const ref = useRef<HTMLDivElement>(null);

  const mergedStyle = useMemo(
    () => ({
      ...(style || {}),
      ...(delayMs ? { transitionDelay: `${delayMs}ms` } : {}),
    }),
    [style, delayMs]
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // If already revealed (e.g., re-mount), skip observing
    if ((el.dataset as any)['revealed'] === 'true') {
      el.classList.add('reveal-visible');
      return;
    }

    const io = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            target.classList.add('reveal-visible');
            (target.dataset as any)['revealed'] = 'true';
            obs.unobserve(target);
          }
        }
      },
      {
        rootMargin: COMPONENT_CONFIG.PERFORMANCE.INTERSECTION_ROOT_MARGIN,
        threshold: COMPONENT_CONFIG.PERFORMANCE.INTERSECTION_THRESHOLD,
      }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} id={id} className={cn('reveal', className)} style={mergedStyle}>
      {children}
    </div>
  );
};

// Memoized component for performance optimization
export const Reveal = memo(RevealComponent);
Reveal.displayName = 'Reveal';

// Default export for backward compatibility
export default Reveal;
