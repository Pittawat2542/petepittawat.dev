import {
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionStyle,
} from 'framer-motion';
import { useCallback, useEffect, useState, type PointerEvent as ReactPointerEvent } from 'react';

import { ACCENT_COLOR } from './config';

interface UseInteractiveTiltResult {
  readonly prefersReducedMotion: boolean;
  readonly fieldBackground: ReturnType<typeof useMotionTemplate>;
  readonly handlePointerMove: (event: ReactPointerEvent<HTMLAnchorElement>) => void;
  readonly resetTilt: () => void;
  readonly logoStyle: MotionStyle;
}

export function useInteractiveTilt(): UseInteractiveTiltResult {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const [canTilt, setCanTilt] = useState(false);

  const tiltX = useSpring(0, { stiffness: 180, damping: 20, mass: 0.8 });
  const tiltY = useSpring(0, { stiffness: 180, damping: 20, mass: 0.8 });

  const pointerX = useMotionValue(0.5);
  const pointerY = useMotionValue(0.5);
  const pointerXPercent = useTransform(pointerX, value => value * 100);
  const pointerYPercent = useTransform(pointerY, value => value * 100);

  const fieldBackground = useMotionTemplate`
    radial-gradient(120% 120% at ${pointerXPercent}% ${pointerYPercent}%,
      rgba(255, 255, 255, 0.52),
      color-mix(in oklab, ${ACCENT_COLOR} 42%, rgba(255, 255, 255, 0.08)) 62%,
      transparent 78%)
  `;

  useEffect(() => {
    if (prefersReducedMotion || typeof window === 'undefined') {
      setCanTilt(false);
      return;
    }

    const media = window.matchMedia('(pointer: fine) and (hover: hover)');
    setCanTilt(media.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setCanTilt(event.matches);
    };

    media.addEventListener('change', handleChange);
    return () => media.removeEventListener('change', handleChange);
  }, [prefersReducedMotion]);

  const handlePointerMove = useCallback<UseInteractiveTiltResult['handlePointerMove']>(
    event => {
      if (!canTilt || prefersReducedMotion) return;

      const target = event.currentTarget;
      const rect = target.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;

      const rotateX = (0.5 - y) * 16;
      const rotateY = (x - 0.5) * 16;

      tiltX.set(rotateX);
      tiltY.set(rotateY);
      pointerX.set(x);
      pointerY.set(y);
    },
    [canTilt, prefersReducedMotion, pointerX, pointerY, tiltX, tiltY]
  );

  const resetTilt = useCallback(() => {
    tiltX.set(0);
    tiltY.set(0);
    pointerX.set(0.5);
    pointerY.set(0.5);
  }, [pointerX, pointerY, tiltX, tiltY]);

  const logoStyle: MotionStyle = prefersReducedMotion
    ? {}
    : {
        rotateX: tiltX,
        rotateY: tiltY,
        transformPerspective: 800,
      };

  return {
    prefersReducedMotion,
    fieldBackground,
    handlePointerMove,
    resetTilt,
    logoStyle,
  };
}
