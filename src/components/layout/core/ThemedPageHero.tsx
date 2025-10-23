import { memo, useEffect, useRef, type CSSProperties, type FC, type ReactNode } from 'react';
import { THEMED_PAGE_HERO_STYLES } from './themedPageHeroStyles';

interface ThemedPageHeroProps {
  readonly title: string;
  readonly subtitle?: string;
  readonly page: string;
  readonly children?: ReactNode;
}

const formatPageLabel = (value: string) =>
  value
    .split(/[-_]+/g)
    .filter(Boolean)
    .map(segment => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  depth: number;
  radius: number;
}

type LegacyMediaQueryList = {
  addListener: (listener: (event: MediaQueryListEvent) => void) => void;
  removeListener: (listener: (event: MediaQueryListEvent) => void) => void;
};

const HeroBackdrop: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof window === 'undefined') return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const particles: Particle[] = [];
    const animationState = { visible: true, allowMotion: true };
    const linkRange = 140;
    const outOfBoundsMargin = 48;
    let hasStaticFrame = false;

    const createParticle = (width: number, height: number): Particle => {
      const depth = Math.random() * 0.8 + 0.2;
      const radius = 0.7 + depth * 2;
      const speedBase = 0.08 + depth * 0.12;

      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * speedBase,
        vy: (Math.random() - 0.5) * speedBase,
        depth,
        radius,
      };
    };

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      canvas.width = width * dpr;
      canvas.height = height * dpr;

      if (typeof context.resetTransform === 'function') {
        context.resetTransform();
      } else {
        context.setTransform(1, 0, 0, 1, 0, 0);
      }
      context.scale(dpr, dpr);

      const targetCount = Math.max(24, Math.min(68, Math.floor((width * height) / 24000)));
      while (particles.length < targetCount) {
        particles.push(createParticle(width, height));
      }
      if (particles.length > targetCount) {
        particles.length = targetCount;
      }
    };

    const renderParticles = (width: number, height: number, animate: boolean) => {
      context.clearRect(0, 0, width, height);

      for (const particle of particles) {
        if (animate) {
          particle.x += particle.vx;
          particle.y += particle.vy;

          if (
            particle.x < -outOfBoundsMargin ||
            particle.x > width + outOfBoundsMargin ||
            particle.y < -outOfBoundsMargin ||
            particle.y > height + outOfBoundsMargin
          ) {
            const respawnEdge = Math.random();
            if (respawnEdge < 0.25) {
              particle.x = Math.random() * width;
              particle.y = -outOfBoundsMargin * 0.5;
            } else if (respawnEdge < 0.5) {
              particle.x = width + outOfBoundsMargin * 0.5;
              particle.y = Math.random() * height;
            } else if (respawnEdge < 0.75) {
              particle.x = Math.random() * width;
              particle.y = height + outOfBoundsMargin * 0.5;
            } else {
              particle.x = -outOfBoundsMargin * 0.5;
              particle.y = Math.random() * height;
            }
            particle.depth = Math.random() * 0.8 + 0.2;
            particle.radius = 0.7 + particle.depth * 2;
            const speedBase = 0.08 + particle.depth * 0.12;
            particle.vx = (Math.random() - 0.5) * speedBase;
            particle.vy = (Math.random() - 0.5) * speedBase;
          }
        }

        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fillStyle = `rgba(255,255,255,${0.18 + particle.depth * 0.35})`;
        context.shadowBlur = 6 + particle.depth * 12;
        context.shadowColor = 'rgba(255,255,255,0.45)';
        context.fill();
        context.shadowBlur = 0;
        context.shadowColor = 'transparent';
      }

      for (let i = 0; i < particles.length; i += 1) {
        for (let j = i + 1; j < particles.length; j += 1) {
          const a = particles[i]!;
          const b = particles[j]!;
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distance = Math.hypot(dx, dy);

          if (distance > linkRange) continue;

          const alpha = Math.max(0, 0.08 + ((1 - distance / linkRange) * (a.depth + b.depth)) / 2);
          context.beginPath();
          context.moveTo(a.x, a.y);
          context.lineTo(b.x, b.y);
          context.strokeStyle = `rgba(255,255,255,${alpha})`;
          context.lineWidth = 0.6;
          context.stroke();
        }
      }
    };

    const drawFrame = (animate: boolean) => {
      const { width, height } = canvas.getBoundingClientRect();
      if (width === 0 || height === 0) return;
      renderParticles(width, height, animate);
    };

    const step = () => {
      const shouldAnimate = animationState.allowMotion && animationState.visible;
      if (shouldAnimate) {
        drawFrame(true);
        hasStaticFrame = false;
      } else if (!hasStaticFrame) {
        drawFrame(false);
        hasStaticFrame = true;
      }
      animationRef.current = window.requestAnimationFrame(step);
    };

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionPreference = () => {
      animationState.allowMotion = !mediaQuery.matches;
      hasStaticFrame = false;
    };

    const intersectionObserver = new IntersectionObserver(
      entries => {
        animationState.visible = entries.some(entry => entry.isIntersecting);
        if (animationState.visible) {
          hasStaticFrame = false;
        }
      },
      { threshold: 0.1 }
    );

    resizeCanvas();
    handleMotionPreference();
    drawFrame(false);
    animationRef.current = window.requestAnimationFrame(step);
    intersectionObserver.observe(canvas);
    window.addEventListener('resize', resizeCanvas);
    let teardownMotionListener = () => {};
    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleMotionPreference);
      teardownMotionListener = () =>
        mediaQuery.removeEventListener('change', handleMotionPreference);
    } else if ('addListener' in mediaQuery) {
      const legacyMediaQuery = mediaQuery as unknown as LegacyMediaQueryList;
      legacyMediaQuery.addListener(handleMotionPreference);
      teardownMotionListener = () => legacyMediaQuery.removeListener(handleMotionPreference);
    }

    return () => {
      if (animationRef.current) {
        window.cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', resizeCanvas);
      teardownMotionListener();
      intersectionObserver.disconnect();
    };
  }, []);

  return (
    <div className="themed-hero__backdrop" aria-hidden="true">
      <canvas ref={canvasRef} className="themed-hero__particles" />
      <div className="themed-hero__gradient" />
      <div className="themed-hero__beam themed-hero__beam--one" />
      <div className="themed-hero__beam themed-hero__beam--two" />
      <div className="themed-hero__grid" />
      <div className="themed-hero__orb themed-hero__orb--one" />
      <div className="themed-hero__orb themed-hero__orb--two" />
    </div>
  );
};

const ThemedPageHeroComponent: FC<ThemedPageHeroProps> = ({ title, subtitle, page, children }) => {
  const heroStyle = {
    '--hero-accent': `var(--accent-${page}, var(--accent, #6ac1ff))`,
  } as CSSProperties;

  const sectionLabel = formatPageLabel(page) || 'Overview';

  return (
    <>
      <section className="themed-hero" style={heroStyle} data-page={page}>
        <HeroBackdrop />
        <div className="themed-hero__shine" aria-hidden="true" />
        <div className="themed-hero__inner">
          <span className="themed-hero__badge">
            <span className="themed-hero__badge-dot" />
            {sectionLabel}
          </span>
          <h1 className="themed-hero__title">{title}</h1>
          {subtitle ? <p className="themed-hero__subtitle">{subtitle}</p> : null}
          {children ? <div className="themed-hero__actions">{children}</div> : null}
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: THEMED_PAGE_HERO_STYLES }} />
    </>
  );
};

const ThemedPageHero = memo(ThemedPageHeroComponent);
ThemedPageHero.displayName = 'ThemedPageHero';

export default ThemedPageHero;
export { ThemedPageHero };
