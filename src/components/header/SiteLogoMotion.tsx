import { motion, useReducedMotion, useSpring } from 'framer-motion';
import type { MotionStyle, Transition, Variants } from 'framer-motion';
import { useCallback, useEffect, useMemo, useState, type PointerEventHandler } from 'react';

import { cn } from '@/lib/utils';

interface SiteLogoMotionProps {
  readonly showTitle?: boolean;
  readonly className?: string;
  readonly siteTitle: string;
}

const sparks = [
  { id: 'alpha', delay: 0 },
  { id: 'beta', delay: 3.2 }
];

export function SiteLogoMotion({ showTitle = true, className = '', siteTitle }: SiteLogoMotionProps) {
  const prefersReducedMotion = useReducedMotion();
  const [canTilt, setCanTilt] = useState(false);

  const tiltX = useSpring(0, {
    stiffness: 180,
    damping: 20,
    mass: 0.8
  });
  const tiltY = useSpring(0, {
    stiffness: 180,
    damping: 20,
    mass: 0.8
  });

  useEffect(() => {
    if (prefersReducedMotion) {
      setCanTilt(false);
      return;
    }

    if (typeof window === 'undefined') return;
    const media = window.matchMedia('(pointer: fine) and (hover: hover)');
    setCanTilt(media.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setCanTilt(event.matches);
    };

    media.addEventListener('change', handleChange);
    return () => {
      media.removeEventListener('change', handleChange);
    };
  }, [prefersReducedMotion]);

  const handlePointerMove = useCallback<PointerEventHandler<HTMLAnchorElement>>(
    (event) => {
      if (!canTilt || prefersReducedMotion) return;
      const target = event.currentTarget;
      const rect = target.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;

      const rotateX = (0.5 - y) * 16;
      const rotateY = (x - 0.5) * 16;

      tiltX.set(rotateX);
      tiltY.set(rotateY);
    },
    [canTilt, prefersReducedMotion, tiltX, tiltY]
  );

  const resetTilt = useCallback(() => {
    tiltX.set(0);
    tiltY.set(0);
  }, [tiltX, tiltY]);

  const containerVariants = useMemo<Variants>(
    () => ({
      initial: { opacity: 0, scale: 0.9, rotate: -6 },
      animate: {
        opacity: 1,
        scale: 1,
        rotate: 0,
        transition: { type: 'spring', stiffness: 160, damping: 20, mass: 0.8 }
      },
      hover: {
        scale: 1.02,
        rotate: -1.2,
        transition: { type: 'spring', stiffness: 260, damping: 18 }
      },
      tap: {
        scale: 0.98,
        rotate: 0
      }
    }),
    []
  );

  const logoVariants = useMemo<Variants>(
    () => ({
      initial: { scale: 0.86, rotate: -4, y: 0 },
      animate: {
        scale: 1,
        rotate: 0,
        y: 0,
        transition: { type: 'spring', stiffness: 340, damping: 24, delay: 0.08 }
      },
      hover: {
        scale: 1.07,
        rotate: -2.4,
        transition: { type: 'spring', stiffness: 320, damping: 16 }
      },
      tap: { scale: 0.97, rotate: 0 }
    }),
    []
  );

  const markVariants = useMemo<Variants>(
    () => ({
      initial: { scale: 0.82, rotate: -12, y: 2 },
      animate: {
        scale: 1,
        rotate: 0,
        y: 0,
        transition: { type: 'spring', stiffness: 380, damping: 22, delay: 0.14 }
      },
      hover: {
        rotate: 4,
        y: -2,
        transition: { type: 'spring', stiffness: 260, damping: 18 }
      },
      tap: {
        scale: 0.96,
        rotate: 0,
        y: 0
      }
    }),
    []
  );

  const glowVariants = useMemo<Variants>(() => {
    if (prefersReducedMotion) {
      const reduced: Variants = {
        initial: { opacity: 0.85, scale: 1 },
        animate: { opacity: 0.9, scale: 1 },
        hover: { opacity: 1, scale: 1.02 }
      };
      return reduced;
    }
    const regular: Variants = {
      initial: { opacity: 0.72, scale: 0.96 },
      animate: {
        opacity: [0.72, 0.9, 0.75],
        scale: [0.96, 1.06, 0.98],
        transition: { duration: 5.6, ease: 'easeInOut', repeat: Infinity }
      },
      hover: { opacity: 1, scale: 1.12 }
    };
    return regular;
  }, [prefersReducedMotion]);

  const haloVariants = useMemo<Variants>(() => {
    if (prefersReducedMotion) {
      const reduced: Variants = {
        initial: { opacity: 0.68, scale: 1 },
        animate: { opacity: 0.7, scale: 1 },
        hover: { opacity: 0.92, scale: 1.06 }
      };
      return reduced;
    }
    const regular: Variants = {
      initial: { opacity: 0.6, scale: 0.98 },
      animate: {
        opacity: [0.6, 0.78, 0.62],
        scale: [0.98, 1.05, 0.98],
        transition: { duration: 6.2, ease: 'easeInOut', repeat: Infinity, delay: 0.4 }
      },
      hover: { opacity: 0.95, scale: 1.08 }
    };
    return regular;
  }, [prefersReducedMotion]);

  const titleVariants = useMemo<Variants>(
    () => ({
      initial: { opacity: 0, y: 8 },
      animate: {
        opacity: 1,
        y: 0,
        transition: { type: 'spring', stiffness: 260, damping: 22, delay: 0.22 }
      }
    }),
    []
  );

  const orbitBaseTransition: Transition | undefined = prefersReducedMotion
    ? undefined
    : {
        repeat: Infinity,
        repeatType: 'loop',
        duration: 7.4,
        ease: 'linear'
      };

  const sparkBaseTransition: Transition | undefined = prefersReducedMotion
    ? undefined
    : {
        duration: 2.4,
        repeat: Infinity,
        repeatType: 'loop',
        ease: 'easeInOut'
      };

  const logoStyle: MotionStyle = prefersReducedMotion
    ? {}
    : {
        rotateX: tiltX,
        rotateY: tiltY,
        transformPerspective: 800
      };

  return (
    <motion.a
      href="/"
      aria-label="Go to homepage"
      className={cn(
        'site-logo-link group snap-start text-[color:var(--white)] flex min-w-0 gap-2 items-center rounded-full px-3 py-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent,#6bc1ff)]/45 focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--black-nav,#020617)] hover:bg-[color:var(--white)]/8',
        className
      )}
      variants={containerVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileFocus="hover"
      whileTap="tap"
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
      onPointerUp={resetTilt}
    >
      <motion.span
        className="site-logo"
        variants={logoVariants}
        style={logoStyle}
      >
        <motion.span className="site-logo__glow" variants={glowVariants} />
        <motion.span className="site-logo__halo" variants={haloVariants} />

        {sparks.map(({ id, delay }) => {
          const orbitProps = prefersReducedMotion
            ? {}
            : { transition: { ...orbitBaseTransition!, delay } };
          const sparkAnimate = prefersReducedMotion
            ? { opacity: 0.85, scale: 1 }
            : {
                opacity: [0, 1, 0],
                scale: [0.7, 1, 0.7],
                transition: { ...sparkBaseTransition!, delay: delay / 2 }
              };

          return (
            <motion.span
              key={id}
              className="site-logo__orbit"
              animate={prefersReducedMotion ? { rotate: 0 } : { rotate: 360 }}
              {...orbitProps}
            >
              <motion.span
                className="site-logo__spark"
                animate={sparkAnimate}
                initial={{ opacity: 0, scale: 0.5 }}
              />
            </motion.span>
          );
        })}

        <motion.svg
          className="site-logo__mark"
          viewBox="0 0 512 512"
          fill="none"
          variants={markVariants}
        >
          <rect x="0" y="0" width="512" height="512" rx="64" fill="#6AC1FF" />
          <g fill="#222831">
            <path d="M82 199.1L291.4 199.1L291.4 298.1C291.4 311.1 288.6 322.3 283 331.7C277.4 341.3 269.5 348.7 259.3 353.9C249.3 359.1 237.7 361.7 224.5 361.7C211.3 361.7 199.7 359.1 189.7 353.9C179.7 348.7 171.8 341.3 166 331.7C160.4 322.3 157.6 311.1 157.6 298.1L157.6 244.7L82 244.7L82 199.1ZM197.2 244.7L197.2 292.7C197.2 297.3 198 301.2 199.6 304.4C201.2 307.6 203.5 310.1 206.5 311.9C209.7 313.7 213.5 314.6 217.9 314.6L231.1 314.6C235.7 314.6 239.5 313.7 242.5 311.9C245.5 310.1 247.8 307.6 249.4 304.4C251 301.2 251.8 297.3 251.8 292.7L251.8 244.7L197.2 244.7Z" />
            <path d="M291 199.1L500.4 199.1L500.4 298.1C500.4 311.1 497.6 322.3 492 331.7C486.4 341.3 478.5 348.7 468.3 353.9C458.3 359.1 446.7 361.7 433.5 361.7C420.3 361.7 408.7 359.1 398.7 353.9C388.7 348.7 380.8 341.3 375 331.7C369.4 322.3 366.6 311.1 366.6 298.1L366.6 244.7L291 244.7L291 199.1ZM406.2 244.7L406.2 292.7C406.2 297.3 407 301.2 408.6 304.4C410.2 307.6 412.5 310.1 415.5 311.9C418.7 313.7 422.5 314.6 426.9 314.6L440.1 314.6C444.7 314.6 448.5 313.7 451.5 311.9C454.5 310.1 456.8 307.6 458.4 304.4C460 301.2 460.8 297.3 460.8 292.7L460.8 244.7L406.2 244.7Z" />
          </g>
        </motion.svg>
      </motion.span>

      {showTitle && (
        <motion.span className="hidden md:inline whitespace-nowrap md:ml-1 font-medium max-w-[40vw] truncate" variants={titleVariants}>
          {siteTitle}
        </motion.span>
      )}
    </motion.a>
  );
}

export default SiteLogoMotion;
