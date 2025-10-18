export const THEMED_PAGE_HERO_STYLES = `
  .themed-hero {
    position: relative;
    margin-top: calc(-1 * clamp(3.5rem, 9vw, 5.5rem));
    padding-top: clamp(3.5rem, 9vw, 6.75rem);
    --hero-gutter: clamp(1.25rem, 5vw, 3.5rem);
    --hero-content-width: min(68rem, calc(100vw - var(--hero-gutter) * 2));
    --hero-accent-soft: color-mix(in oklab, var(--hero-accent) 40%, rgba(15, 23, 42, 0.9));
    --hero-accent-strong: color-mix(in oklab, var(--hero-accent) 68%, rgba(10, 20, 38, 0.85));
    margin: 0 calc(50% - 50vw) clamp(2.5rem, 6vw, 4.5rem);
    padding: clamp(3.5rem, 9vw, 5.5rem) var(--hero-gutter) clamp(2.5rem, 7vw, 4.5rem);
    color: rgba(241, 245, 249, 0.95);
    background:
      radial-gradient(circle at 12% 0%, color-mix(in oklab, var(--hero-accent) 70%, rgba(12, 16, 32, 0.95)) 0%, transparent 58%),
      radial-gradient(circle at 88% 8%, color-mix(in oklab, var(--hero-accent) 32%, rgba(15, 20, 38, 0.92)) 0%, transparent 60%),
      linear-gradient(180deg, rgba(5, 10, 22, 0.96), rgba(6, 12, 27, 0.9));
    border-radius: 0;
    clip-path: none;
    overflow: hidden;
  }

  .themed-hero::before,
  .themed-hero::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 0;
    pointer-events: none;
  }

  .themed-hero::before {
    background: radial-gradient(120% 80% at 50% 0%, rgba(255, 255, 255, 0.04), transparent 72%);
    opacity: 0.6;
    z-index: -3;
  }

  .themed-hero::after {
    background: linear-gradient(180deg, transparent 0%, rgba(6, 12, 27, 0.85) 95%);
    z-index: -1;
  }

  .themed-hero__backdrop {
    position: absolute;
    inset: calc(-1 * clamp(3.5rem, 9vw, 5.5rem)) 0 0 0;
    overflow: hidden;
    pointer-events: none;
    z-index: -2;
    border-radius: 0;
  }

  .themed-hero__particles {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    display: block;
    opacity: 0.68;
    mix-blend-mode: screen;
  }

  .themed-hero__gradient {
    position: absolute;
    inset: -35%;
    background:
      radial-gradient(circle at 10% 20%, color-mix(in oklab, var(--hero-accent) 55%, transparent) 0%, transparent 60%),
      radial-gradient(circle at 82% 70%, color-mix(in oklab, var(--hero-accent) 28%, transparent) 0%, transparent 55%),
      linear-gradient(155deg, rgba(9, 16, 32, 0.85), transparent 70%);
    transform: rotate(1deg);
    filter: blur(90px);
    opacity: 0.9;
  }

  .themed-hero__beam {
    position: absolute;
    inset: -10% -45% 20% -45%;
    background: conic-gradient(from 110deg, rgba(255, 255, 255, 0.14), transparent 68%);
    mix-blend-mode: screen;
    opacity: 0.7;
    animation: hero-beam 28s linear infinite;
  }

  .themed-hero__beam--two {
    animation-duration: 36s;
    animation-direction: reverse;
    opacity: 0.5;
  }

  .themed-hero__grid {
    position: absolute;
    inset: -18%;
    background-image:
      linear-gradient(rgba(148, 163, 184, 0.08) 1px, transparent 1px),
      linear-gradient(90deg, rgba(148, 163, 184, 0.07) 1px, transparent 1px);
    background-size: clamp(70px, 6vw, 120px) clamp(70px, 6vw, 120px);
    transform: rotate(3deg) scale(1.25);
    opacity: 0.35;
    mix-blend-mode: overlay;
    animation: hero-grid 40s linear infinite;
  }

  .themed-hero__orb {
    position: absolute;
    width: clamp(220px, 22vw, 340px);
    height: clamp(220px, 22vw, 340px);
    border-radius: 9999px;
    background: radial-gradient(circle, color-mix(in oklab, var(--hero-accent) 65%, transparent) 0%, transparent 70%);
    filter: blur(40px);
    opacity: 0.5;
    mix-blend-mode: screen;
    animation: hero-orbit 30s ease-in-out infinite;
    mask-image: radial-gradient(circle, rgba(0, 0, 0, 0.9), transparent 70%);
  }

  .themed-hero__orb--one {
    top: 18%;
    left: clamp(-16%, -8vw, -6%);
  }

  .themed-hero__orb--two {
    bottom: 18%;
    right: clamp(-16%, -8vw, -6%);
    animation-direction: reverse;
    animation-duration: 36s;
  }

  .themed-hero__shine {
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 50% 0%, color-mix(in oklab, var(--hero-accent) 65%, rgba(255, 255, 255, 0.1)), transparent 68%);
    opacity: 0.75;
    mix-blend-mode: screen;
    pointer-events: none;
  }

  .themed-hero__inner {
    position: relative;
    margin: 0 auto;
    width: var(--hero-content-width);
    display: grid;
    gap: clamp(1.1rem, 2.4vw, 2rem);
    text-align: center;
    align-items: center;
    justify-items: center;
  }

  .themed-hero__badge {
    display: inline-flex;
    align-items: center;
    gap: 0.55rem;
    padding: 0.32rem 1rem;
    border-radius: 9999px;
    font-size: 0.72rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: rgba(226, 232, 240, 0.76);
    background: rgba(12, 18, 36, 0.6);
    border: 1px solid color-mix(in oklab, var(--hero-accent) 35%, rgba(148, 163, 184, 0.28));
    backdrop-filter: blur(12px);
  }

  .themed-hero__badge-dot {
    width: 0.55rem;
    height: 0.55rem;
    border-radius: 9999px;
    background: color-mix(in oklab, var(--hero-accent) 78%, rgba(248, 250, 252, 0.35));
    box-shadow: 0 0 16px color-mix(in oklab, var(--hero-accent) 62%, transparent);
  }

  .themed-hero__title {
    font-size: clamp(2.2rem, 5vw, 3.4rem);
    line-height: 1.08;
    letter-spacing: -0.025em;
    font-weight: 700;
    color: rgba(248, 250, 252, 0.98);
  }

  .themed-hero__subtitle {
    font-size: clamp(1rem, 2.4vw, 1.25rem);
    line-height: 1.5;
    color: rgba(226, 232, 240, 0.82);
    max-width: 68ch;
    margin: 0;
  }

  .themed-hero__actions {
    display: inline-flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
  }

  @media (min-width: 960px) {
    .themed-hero {
      padding-inline: clamp(4.5rem, 10vw, 7rem);
    }

    .themed-hero__inner {
      justify-items: flex-start;
      text-align: left;
      gap: clamp(1.25rem, 2.5vw, 2.4rem);
    }

    .themed-hero__actions {
      justify-content: flex-start;
    }
  }

  @media (max-width: 640px) {
    .themed-hero {
      margin-inline: calc(50% - 50vw);
      padding-inline: clamp(1.5rem, 6vw, 2.5rem);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .themed-hero,
    .themed-hero__beam,
    .themed-hero__grid,
    .themed-hero__orb {
      animation: none !important;
      transition-duration: 0.001ms !important;
    }
    .themed-hero__particles {
      opacity: 0.4;
    }
  }

  @keyframes hero-beam {
    0% {
      transform: rotate(0deg) translateY(0);
    }
    50% {
      transform: rotate(8deg) translateY(-2%);
    }
    100% {
      transform: rotate(0deg) translateY(0);
    }
  }

  @keyframes hero-grid {
    0% {
      transform: rotate(3deg) scale(1.25) translateY(0);
    }
    50% {
      transform: rotate(5deg) scale(1.28) translateY(-1.5%);
    }
    100% {
      transform: rotate(3deg) scale(1.25) translateY(0);
    }
  }

  @keyframes hero-orbit {
    0% {
      transform: rotate(0deg) translate(0, 0);
    }
    50% {
      transform: rotate(12deg) translate(2%, 1%);
    }
    100% {
      transform: rotate(0deg) translate(0, 0);
    }
  }
`;
