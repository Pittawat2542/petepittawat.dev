import { memo, type CSSProperties, type FC, type ReactNode } from 'react';

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

const ThemedPageHeroComponent: FC<ThemedPageHeroProps> = ({ title, subtitle, page, children }) => {
  const heroStyle = {
    '--hero-accent': `var(--accent-${page})`,
  } as CSSProperties;

  const sectionLabel = formatPageLabel(page) || 'Overview';

  return (
    <>
      <section className="themed-hero" style={heroStyle}>
        <div className="themed-hero__backdrop" aria-hidden="true">
          <div className="themed-hero__gradient" />
          <div className="themed-hero__beam themed-hero__beam--one" />
          <div className="themed-hero__beam themed-hero__beam--two" />
          <div className="themed-hero__grid" />
          <div className="themed-hero__orb themed-hero__orb--one" />
          <div className="themed-hero__orb themed-hero__orb--two" />
        </div>
        <div className="themed-hero__shine" aria-hidden="true" />
        <div className="themed-hero__inner">
          <span className="themed-hero__badge">
            <span className="themed-hero__badge-dot" />
            {sectionLabel}
          </span>
          <h1 className="themed-hero__title">{title}</h1>
          {subtitle && <p className="themed-hero__subtitle">{subtitle}</p>}
          {children && <div className="themed-hero__actions">{children}</div>}
        </div>
      </section>

      <style
        dangerouslySetInnerHTML={{
          __html: `
          .themed-hero {
            position: relative;
            margin: 0 auto clamp(2.5rem, 6vw, 3.75rem);
            padding: clamp(3.5rem, 7vw, 5.25rem) clamp(1.5rem, 3vw, 3rem) clamp(2.5rem, 6vw, 3.5rem);
            max-width: min(75rem, calc(100% - 1.75rem));
            border-radius: clamp(2.25rem, 4vw, 3.5rem);
            overflow: hidden;
            isolation: isolate;
            background: linear-gradient(135deg, rgba(8, 14, 26, 0.88), rgba(12, 19, 36, 0.78));
            backdrop-filter: blur(22px);
            border: 1px solid color-mix(in oklab, var(--hero-accent) 28%, rgba(148, 163, 184, 0.2));
            box-shadow:
              0 35px 70px rgba(3, 7, 18, 0.55),
              inset 0 1px 0 rgba(255, 255, 255, 0.05);
            color: rgba(255, 255, 255, 0.92);
          }

          .themed-hero::after {
            content: '';
            position: absolute;
            inset: 1px;
            border-radius: clamp(2.15rem, 3.8vw, 3.3rem);
            background: radial-gradient(circle at 10% 10%, rgba(255, 255, 255, 0.04), transparent 55%);
            pointer-events: none;
            mix-blend-mode: screen;
          }

          .themed-hero {
            --hero-accent-soft: color-mix(in oklab, var(--hero-accent) 38%, rgba(15, 23, 42, 0.92));
            --hero-accent-strong: color-mix(in oklab, var(--hero-accent) 76%, rgba(13, 20, 36, 0.7));
            --hero-accent-glow: color-mix(in oklab, var(--hero-accent) 64%, rgba(12, 25, 54, 0.45));
          }

          .themed-hero__backdrop {
            position: absolute;
            inset: 0;
            z-index: -2;
            overflow: hidden;
            border-radius: inherit;
            clip-path: inset(0 round inherit);
          }

          .themed-hero__gradient {
            position: absolute;
            inset: -32%;
            border-radius: inherit;
            background:
              radial-gradient(circle at 25% 30%, color-mix(in oklab, var(--hero-accent) 45%, transparent) 0%, transparent 65%),
              radial-gradient(circle at 75% 75%, color-mix(in oklab, var(--hero-accent) 28%, transparent) 0%, transparent 60%),
              linear-gradient(160deg, rgba(10, 16, 32, 0.85), transparent 85%);
            filter: blur(95px);
            opacity: 0.95;
          }

          .themed-hero__beam {
            position: absolute;
            inset: 12% -55% 12% -55%;
            border-radius: inherit;
            background: conic-gradient(from 120deg at 50% 50%, rgba(255, 255, 255, 0.16), transparent 68%);
            mix-blend-mode: screen;
            opacity: 0.75;
            animation: hero-beam 26s linear infinite;
          }

          .themed-hero__beam--two {
            animation-duration: 34s;
            animation-direction: reverse;
            opacity: 0.55;
          }

          .themed-hero__grid {
            position: absolute;
            inset: -30%;
            border-radius: inherit;
            background-image:
              linear-gradient(rgba(148, 163, 184, 0.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(148, 163, 184, 0.07) 1px, transparent 1px);
            background-size: clamp(70px, 6vw, 120px) clamp(70px, 6vw, 120px);
            transform: rotate(2deg) scale(1.15);
            opacity: 0.35;
            mix-blend-mode: overlay;
            animation: hero-grid 40s linear infinite;
          }

          .themed-hero__orb {
            position: absolute;
            width: clamp(220px, 24vw, 340px);
            height: clamp(220px, 24vw, 340px);
            border-radius: 9999px;
            filter: blur(42px);
            opacity: 0.55;
            background: radial-gradient(circle, color-mix(in oklab, var(--hero-accent) 62%, transparent) 0%, transparent 70%);
            mix-blend-mode: screen;
            animation: hero-orbit 30s ease-in-out infinite;
            mask-image: radial-gradient(circle, rgba(0, 0, 0, 0.9), transparent 68%);
            inset: auto;
            top: auto;
            left: auto;
            right: auto;
            bottom: auto;
          }

          .themed-hero__orb--one {
            top: 18%;
            left: -8%;
          }

          .themed-hero__orb--two {
            right: -8%;
            bottom: 8%;
            animation-direction: reverse;
            animation-duration: 36s;
            opacity: 0.45;
          }

          .themed-hero__shine {
            position: absolute;
            inset: 0;
            border-radius: inherit;
            background: radial-gradient(circle at 50% -10%, color-mix(in oklab, var(--hero-accent) 70%, rgba(255, 255, 255, 0.12)), transparent 60%);
            opacity: 0.9;
            mix-blend-mode: screen;
            pointer-events: none;
          }

          .themed-hero__inner {
            position: relative;
            margin: 0 auto;
            max-width: 52rem;
            display: flex;
            flex-direction: column;
            gap: 1.35rem;
            text-align: center;
          }

          .themed-hero__badge {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            padding: 0.35rem 0.95rem;
            border-radius: 9999px;
            font-size: 0.72rem;
            letter-spacing: 0.18em;
            text-transform: uppercase;
            color: rgba(248, 250, 252, 0.68);
            background: rgba(12, 18, 36, 0.6);
            border: 1px solid color-mix(in oklab, var(--hero-accent) 32%, rgba(148, 163, 184, 0.35));
            backdrop-filter: blur(16px);
          }

          .themed-hero__badge-dot {
            width: 0.55rem;
            height: 0.55rem;
            border-radius: 999px;
            background: color-mix(in oklab, var(--hero-accent) 75%, var(--white));
            box-shadow: 0 0 0 4px color-mix(in oklab, var(--hero-accent) 35%, transparent);
          }

          .themed-hero__title {
            font-size: clamp(2.5rem, 7vw, 4.1rem);
            font-weight: 800;
            letter-spacing: -0.02em;
            line-height: 1.08;
            background: linear-gradient(
              120deg,
              color-mix(in oklab, var(--hero-accent) 90%, rgba(255, 255, 255, 0.95)),
              color-mix(in oklab, rgba(255, 255, 255, 0.96) 88%, var(--hero-accent))
            );
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
          }

          .themed-hero__subtitle {
            margin: 0 auto;
            max-width: min(40rem, calc(100% - 1.5rem));
            font-size: clamp(1rem, 1.1vw + 0.7rem, 1.35rem);
            line-height: 1.7;
            color: rgba(240, 245, 255, 0.78);
          }

          .themed-hero__actions {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 0.75rem;
            margin-top: 0.35rem;
          }

          @media (min-width: 768px) {
            .themed-hero {
              padding-inline: clamp(2.5rem, 5vw, 4.25rem);
            }
            .themed-hero__inner {
              text-align: left;
              align-items: flex-start;
              gap: 1.65rem;
            }
            .themed-hero__subtitle {
              margin: 0;
            }
            .themed-hero__actions {
              justify-content: flex-start;
            }
          }

          @media (max-width: 639px) {
            .themed-hero__badge {
              display: none;
            }
          }

          @supports not (backdrop-filter: blur(1px)) {
            .themed-hero {
              background: linear-gradient(135deg, rgba(8, 14, 26, 0.92), rgba(12, 19, 36, 0.86));
            }
          }

          @keyframes hero-beam {
            0% {
              transform: rotate(0deg) scale(1.05);
            }
            100% {
              transform: rotate(360deg) scale(1.05);
            }
          }

          @keyframes hero-grid {
            0% {
              transform: rotate(2deg) scale(1.15) translate3d(0, 0, 0);
            }
            50% {
              transform: rotate(1deg) scale(1.12) translate3d(1%, -1%, 0);
            }
            100% {
              transform: rotate(2deg) scale(1.15) translate3d(-1%, 1%, 0);
            }
          }

          @keyframes hero-orbit {
            0% {
              transform: translate3d(0, 0, 0) scale(1);
            }
            50% {
              transform: translate3d(6%, -6%, 0) scale(1.05);
            }
            100% {
              transform: translate3d(-4%, 5%, 0) scale(1);
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .themed-hero__beam,
            .themed-hero__grid,
            .themed-hero__orb {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
              transform: none !important;
            }
          }
        `,
        }}
      />
    </>
  );
};

const ThemedPageHero = memo(ThemedPageHeroComponent);
ThemedPageHero.displayName = 'ThemedPageHero';

export default ThemedPageHero;
export { ThemedPageHero };
