import React, { useEffect, useMemo, useRef } from 'react';

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
  id?: string;
  style?: React.CSSProperties;
};

export default function Reveal({ children, className = '', delayMs, id, style }: Readonly<RevealProps>) {
  const ref = useRef<HTMLElement | null>(null);

  const mergedStyle = useMemo(() => ({
    ...(style || {}),
    ...(delayMs ? { transitionDelay: `${delayMs}ms` } : {}),
  }), [style, delayMs]);

  useEffect(() => {
    const el = ref.current as Element | null;
    if (!el) return;

    // If already revealed (e.g., re-mount), skip observing
    if (el instanceof HTMLElement && el.dataset.revealed === 'true') {
      el.classList.add('reveal-visible');
      return;
    }

    const io = new IntersectionObserver((entries, obs) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          const target = e.target as HTMLElement;
          target.classList.add('reveal-visible');
          target.dataset.revealed = 'true';
          obs.unobserve(target);
        }
      }
    }, { rootMargin: '0px 0px -5% 0px', threshold: 0.05 });

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref as any} id={id} className={`reveal ${className}`} style={mergedStyle}>
      {children}
    </div>
  );
}
