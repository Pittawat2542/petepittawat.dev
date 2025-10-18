import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from 'react';

import { ACCENT_COLOR } from './config';

interface UseInteractiveTiltResult {
  readonly prefersReducedMotion: boolean;
  readonly fieldBackground: string;
  readonly handlePointerMove: (event: ReactPointerEvent<HTMLAnchorElement>) => void;
  readonly resetTilt: () => void;
  readonly logoStyle: CSSProperties;
}

const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1);

export function useInteractiveTilt(): UseInteractiveTiltResult {
  const frameRef = useRef<number | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [canTilt, setCanTilt] = useState(false);
  const [pointer, setPointer] = useState({ x: 0.5, y: 0.5 });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;

    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setPrefersReducedMotion(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || prefersReducedMotion) {
      setCanTilt(false);
      return;
    }

    const media = window.matchMedia('(pointer: fine) and (hover: hover)');
    const update = () => setCanTilt(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, [prefersReducedMotion]);

  useEffect(() => {
    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, []);

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLAnchorElement>) => {
      if (!canTilt || prefersReducedMotion) return;

      const rect = event.currentTarget.getBoundingClientRect();
      const x = clamp01((event.clientX - rect.left) / rect.width);
      const y = clamp01((event.clientY - rect.top) / rect.height);

      const rotateX = (0.5 - y) * 16;
      const rotateY = (x - 0.5) * 16;

      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }

      frameRef.current = requestAnimationFrame(() => {
        setPointer({ x, y });
        setTilt({ x: rotateX, y: rotateY });
        frameRef.current = null;
      });
    },
    [canTilt, prefersReducedMotion]
  );

  const resetTilt = useCallback(() => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
    setPointer({ x: 0.5, y: 0.5 });
    setTilt({ x: 0, y: 0 });
  }, []);

  const fieldBackground = useMemo(
    () =>
      `radial-gradient(120% 120% at ${pointer.x * 100}% ${pointer.y * 100}%, rgba(255, 255, 255, 0.52), color-mix(in oklab, ${ACCENT_COLOR} 42%, rgba(255, 255, 255, 0.08)) 62%, transparent 78%)`,
    [pointer.x, pointer.y]
  );

  const logoStyle = useMemo<CSSProperties>(() => {
    if (prefersReducedMotion) return {};
    return {
      transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
      willChange: 'transform',
    };
  }, [prefersReducedMotion, tilt.x, tilt.y]);

  return {
    prefersReducedMotion,
    fieldBackground,
    handlePointerMove,
    resetTilt,
    logoStyle,
  };
}
