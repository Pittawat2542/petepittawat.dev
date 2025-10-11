import type { Transition } from 'framer-motion';

import { UI_CONFIG } from './constants';

const { DURATION, EASING, SPRING, STAGGER } = UI_CONFIG.ANIMATION;

const toSeconds = (durationMs: number) => durationMs / 1000;
const MIN_DURATION_MS = 1;

const prefersReducedMotion = () => {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

export const animationDurations = {
  fast: toSeconds(DURATION.FAST),
  normal: toSeconds(DURATION.NORMAL),
  slow: toSeconds(DURATION.SLOW),
  emphasized: toSeconds(DURATION.EMPHASIZED),
};

export const animationDurationsMs = {
  fast: DURATION.FAST,
  normal: DURATION.NORMAL,
  slow: DURATION.SLOW,
  emphasized: DURATION.EMPHASIZED,
};

export const animationDelays = {
  xs: STAGGER.XS,
  sm: STAGGER.SM,
  md: STAGGER.MD,
  lg: STAGGER.LG,
};

export const animationEasings = {
  standard: EASING.STANDARD,
  emphasized: EASING.EMPHASIZED,
  decelerate: EASING.DECELERATE,
  accelerate: EASING.ACCELERATE,
} as const;

type SpringPreset = keyof typeof SPRING;

type SpringOverrides = Partial<Transition> & {
  readonly respectReducedMotion?: boolean;
};

export const createSpringTransition = (
  preset: SpringPreset = 'DEFAULT',
  overrides: SpringOverrides = {}
): Transition => {
  const { respectReducedMotion = true, delay = 0, ...rest } = overrides;
  const shouldReduce = respectReducedMotion && prefersReducedMotion();

  if (shouldReduce) {
    return {
      type: 'tween',
      duration: toSeconds(MIN_DURATION_MS),
      ease: animationEasings.standard,
      delay: 0,
      ...rest,
    };
  }

  return {
    type: 'spring',
    stiffness: SPRING[preset].STIFFNESS,
    damping: SPRING[preset].DAMPING,
    mass: SPRING[preset].MASS,
    restSpeed: 0.01,
    restDelta: 0.005,
    delay,
    ...rest,
  };
};

interface TimingOptions {
  readonly duration?: number;
  readonly easing?: Transition['ease'];
  readonly delay?: number;
  readonly respectReducedMotion?: boolean;
}

export const createTimingTransition = (options: TimingOptions = {}): Transition => {
  const {
    duration = DURATION.NORMAL,
    easing = animationEasings.standard,
    delay = 0,
    respectReducedMotion = true,
  } = options;

  const shouldReduce = respectReducedMotion && prefersReducedMotion();
  const resolvedDurationMs = shouldReduce ? MIN_DURATION_MS : duration;

  return {
    duration: toSeconds(resolvedDurationMs),
    ease: easing,
    delay: shouldReduce ? 0 : delay,
  };
};

export const getStaggerDelay = (index: number, baseDelay: number = animationDelays.sm) =>
  index * baseDelay;
