import type { TargetAndTransition, Transition, Variants } from 'framer-motion';

export const containerVariants: Variants = {
  initial: { opacity: 0, scale: 0.9, rotate: -6 },
  animate: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { type: 'spring', stiffness: 160, damping: 20, mass: 0.8 },
  },
  hover: {
    scale: 1.02,
    rotate: -1.2,
    transition: { type: 'spring', stiffness: 260, damping: 18 },
  },
  tap: {
    scale: 0.98,
    rotate: 0,
  },
};

export const logoVariants: Variants = {
  initial: { scale: 0.86, rotate: -4, y: 0 },
  animate: {
    scale: 1,
    rotate: 0,
    y: 0,
    transition: { type: 'spring', stiffness: 340, damping: 24, delay: 0.08 },
  },
  hover: {
    scale: 1.07,
    rotate: -2.4,
    transition: { type: 'spring', stiffness: 320, damping: 16 },
  },
  tap: { scale: 0.97, rotate: 0 },
};

export const markVariants: Variants = {
  initial: { scale: 0.82, rotate: -12, y: 2 },
  animate: {
    scale: 1,
    rotate: 0,
    y: 0,
    transition: { type: 'spring', stiffness: 380, damping: 22, delay: 0.14 },
  },
  hover: {
    rotate: 4,
    y: -2,
    transition: { type: 'spring', stiffness: 260, damping: 18 },
  },
  tap: {
    scale: 0.96,
    rotate: 0,
    y: 0,
  },
};

export const titleVariants: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 260, damping: 22, delay: 0.22 },
  },
  hover: {
    y: -1,
    color: 'var(--accent, #6ac1ff)',
    transition: { type: 'spring', stiffness: 320, damping: 24 },
  },
};

export const createGlowVariants = (prefersReducedMotion: boolean): Variants =>
  prefersReducedMotion
    ? {
        initial: { opacity: 0.85, scale: 1 },
        animate: { opacity: 0.9, scale: 1 },
        hover: { opacity: 1, scale: 1.02 },
      }
    : {
        initial: { opacity: 0.72, scale: 0.96 },
        animate: {
          opacity: [0.72, 0.9, 0.75],
          scale: [0.96, 1.06, 0.98],
          transition: { duration: 5.6, ease: 'easeInOut', repeat: Infinity },
        },
        hover: { opacity: 1, scale: 1.12 },
      };

export const createHaloVariants = (prefersReducedMotion: boolean): Variants =>
  prefersReducedMotion
    ? {
        initial: { opacity: 0.68, scale: 1 },
        animate: { opacity: 0.7, scale: 1 },
        hover: { opacity: 0.92, scale: 1.06 },
      }
    : {
        initial: { opacity: 0.6, scale: 0.98 },
        animate: {
          opacity: [0.6, 0.78, 0.62],
          scale: [0.98, 1.05, 0.98],
          transition: { duration: 6.2, ease: 'easeInOut', repeat: Infinity, delay: 0.4 },
        },
        hover: { opacity: 0.95, scale: 1.08 },
      };

export const createFieldVariants = (prefersReducedMotion: boolean): Variants =>
  prefersReducedMotion
    ? {
        initial: { opacity: 0.6, scale: 1 },
        animate: { opacity: 0.62, scale: 1 },
        hover: { opacity: 0.75, scale: 1.04 },
      }
    : {
        initial: { opacity: 0.42, scale: 0.94 },
        animate: {
          opacity: [0.42, 0.68, 0.5],
          scale: [0.94, 1.05, 0.98],
          transition: { duration: 6.4, ease: 'easeInOut', repeat: Infinity, delay: 0.2 },
        },
        hover: { opacity: 0.92, scale: 1.12 },
      };

export const createTrailVariants = (prefersReducedMotion: boolean): Variants =>
  prefersReducedMotion
    ? {
        initial: { opacity: 0.28, scale: 1 },
        hover: { opacity: 0.38, scale: 1.02 },
      }
    : {
        initial: { opacity: 0.12, scale: 0.96, rotate: -8 },
        animate: {
          opacity: [0.12, 0.32, 0.18],
          scale: [0.96, 1.08, 0.98],
          rotate: [-8, -2, -8],
          transition: { duration: 5.8, ease: 'easeInOut', repeat: Infinity, delay: 0.6 },
        },
        hover: { opacity: 0.45, scale: 1.12 },
      };

export const createFlareVariants = (prefersReducedMotion: boolean): Variants =>
  prefersReducedMotion
    ? {
        initial: { opacity: 0.18, rotate: 0 },
        hover: { opacity: 0.32, rotate: 18 },
      }
    : {
        initial: { opacity: 0.12, rotate: -12 },
        animate: {
          opacity: [0.12, 0.26, 0.14],
          rotate: [-12, 12, -12],
          transition: { duration: 10.5, ease: 'easeInOut', repeat: Infinity, delay: 0.8 },
        },
        hover: { opacity: 0.34, rotate: 22 },
      };

export const getOrbitTransition = (
  prefersReducedMotion: boolean,
  delay: number
): Transition | undefined =>
  prefersReducedMotion
    ? undefined
    : {
        repeat: Infinity,
        repeatType: 'loop',
        duration: 7.4,
        ease: 'linear',
        delay,
      };

export const getSparkAnimation = (
  prefersReducedMotion: boolean,
  delay: number
): TargetAndTransition =>
  prefersReducedMotion
    ? { opacity: 0.85, scale: 1 }
    : {
        opacity: [0, 1, 0],
        scale: [0.7, 1, 0.7],
        transition: {
          duration: 2.4,
          repeat: Infinity,
          repeatType: 'loop',
          ease: 'easeInOut',
          delay: delay / 2,
        },
      };
