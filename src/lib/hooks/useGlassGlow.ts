import type { CSSProperties, MouseEvent as ReactMouseEvent } from 'react';
import { useCallback, useMemo } from 'react';

export function useGlassGlow<T extends HTMLElement>() {
  const glowStyle = useMemo(
    () => ({ '--glass-glow-x': '50%', '--glass-glow-y': '50%' }) as CSSProperties,
    []
  );

  const handleMouseMove = useCallback((event: ReactMouseEvent<T>) => {
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    target.style.setProperty('--glass-glow-x', `${x}%`);
    target.style.setProperty('--glass-glow-y', `${y}%`);
  }, []);

  const handleMouseLeave = useCallback((event: ReactMouseEvent<T>) => {
    const target = event.currentTarget as HTMLElement;
    target.style.setProperty('--glass-glow-x', '50%');
    target.style.setProperty('--glass-glow-y', '50%');
  }, []);

  return { glowStyle, handleMouseMove, handleMouseLeave };
}
