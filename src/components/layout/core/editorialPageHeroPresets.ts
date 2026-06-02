type EditorialPageHeroStar = {
  className: string;
  style: string;
};

type EditorialPageHeroPreset = {
  stars: readonly EditorialPageHeroStar[];
};

export type EditorialPageHeroVisualPreset =
  | 'blog'
  | 'projects'
  | 'publications'
  | 'talks'
  | 'default';

export const blogHeroStars = [
  {
    className: 'editorial-page-hero__star',
    style:
      '--star-x: 54%; --star-y: 24%; --star-size: 0.16rem; --star-delay: 120ms; --star-drift-x: -0.38rem; --star-drift-y: -0.2rem;',
  },
  {
    className: 'editorial-page-hero__star',
    style:
      '--star-x: 64%; --star-y: 38%; --star-size: 0.24rem; --star-delay: 210ms; --star-drift-x: 0.28rem; --star-drift-y: -0.34rem;',
  },
  {
    className: 'editorial-page-hero__star',
    style:
      '--star-x: 80%; --star-y: 18%; --star-size: 0.13rem; --star-delay: 310ms; --star-drift-x: 0.34rem; --star-drift-y: 0.12rem;',
  },
  {
    className: 'editorial-page-hero__star editorial-page-hero__star--warm',
    style:
      '--star-x: 86%; --star-y: 71%; --star-size: 0.18rem; --star-delay: 430ms; --star-drift-x: 0.24rem; --star-drift-y: 0.3rem;',
  },
  {
    className: 'editorial-page-hero__star',
    style:
      '--star-x: 72%; --star-y: 82%; --star-size: 0.12rem; --star-delay: 520ms; --star-drift-x: -0.22rem; --star-drift-y: 0.26rem;',
  },
] as const;

export const projectsHeroStars = [
  {
    className: 'editorial-page-hero__star editorial-page-hero__star--projects',
    style:
      '--star-x: 56%; --star-y: 22%; --star-size: 0.14rem; --star-delay: 100ms; --star-drift-x: -0.3rem; --star-drift-y: 0.1rem;',
  },
  {
    className: 'editorial-page-hero__star editorial-page-hero__star--projects',
    style:
      '--star-x: 66%; --star-y: 42%; --star-size: 0.22rem; --star-delay: 200ms; --star-drift-x: 0.2rem; --star-drift-y: -0.25rem;',
  },
  {
    className: 'editorial-page-hero__star editorial-page-hero__star--projects',
    style:
      '--star-x: 82%; --star-y: 26%; --star-size: 0.16rem; --star-delay: 300ms; --star-drift-x: 0.3rem; --star-drift-y: 0.2rem;',
  },
  {
    className:
      'editorial-page-hero__star editorial-page-hero__star--projects editorial-page-hero__star--cyan-warm',
    style:
      '--star-x: 74%; --star-y: 74%; --star-size: 0.18rem; --star-delay: 400ms; --star-drift-x: -0.2rem; --star-drift-y: 0.3rem;',
  },
  {
    className: 'editorial-page-hero__star editorial-page-hero__star--projects',
    style:
      '--star-x: 88%; --star-y: 52%; --star-size: 0.12rem; --star-delay: 500ms; --star-drift-x: 0.25rem; --star-drift-y: -0.15rem;',
  },
] as const;

export const publicationsHeroStars = [
  {
    className: 'editorial-page-hero__star editorial-page-hero__star--publications',
    style:
      '--star-x: 60%; --star-y: 15%; --star-size: 0.15rem; --star-delay: 150ms; --star-drift-x: -0.25rem; --star-drift-y: 0.2rem;',
  },
  {
    className: 'editorial-page-hero__star editorial-page-hero__star--publications',
    style:
      '--star-x: 72%; --star-y: 38%; --star-size: 0.2rem; --star-delay: 250ms; --star-drift-x: 0.3rem; --star-drift-y: -0.2rem;',
  },
  {
    className: 'editorial-page-hero__star editorial-page-hero__star--publications',
    style:
      '--star-x: 52%; --star-y: 65%; --star-size: 0.13rem; --star-delay: 350ms; --star-drift-x: -0.2rem; --star-drift-y: -0.3rem;',
  },
  {
    className:
      'editorial-page-hero__star editorial-page-hero__star--publications editorial-page-hero__star--emerald-warm',
    style:
      '--star-x: 84%; --star-y: 68%; --star-size: 0.24rem; --star-delay: 450ms; --star-drift-x: 0.25rem; --star-drift-y: 0.25rem;',
  },
  {
    className: 'editorial-page-hero__star editorial-page-hero__star--publications',
    style:
      '--star-x: 78%; --star-y: 82%; --star-size: 0.12rem; --star-delay: 550ms; --star-drift-x: 0.15rem; --star-drift-y: -0.2rem;',
  },
] as const;

export const talksHeroStars = [
  {
    className: 'editorial-page-hero__star editorial-page-hero__star--talks',
    style:
      '--star-x: 58%; --star-y: 30%; --star-size: 0.16rem; --star-delay: 100ms; --star-drift-x: 0.2rem; --star-drift-y: -0.2rem;',
  },
  {
    className: 'editorial-page-hero__star editorial-page-hero__star--talks',
    style:
      '--star-x: 68%; --star-y: 22%; --star-size: 0.22rem; --star-delay: 200ms; --star-drift-x: -0.25rem; --star-drift-y: 0.15rem;',
  },
  {
    className: 'editorial-page-hero__star editorial-page-hero__star--talks',
    style:
      '--star-x: 78%; --star-y: 48%; --star-size: 0.14rem; --star-delay: 300ms; --star-drift-x: 0.3rem; --star-drift-y: 0.3rem;',
  },
  {
    className:
      'editorial-page-hero__star editorial-page-hero__star--talks editorial-page-hero__star--orange-warm',
    style:
      '--star-x: 88%; --star-y: 32%; --star-size: 0.18rem; --star-delay: 400ms; --star-drift-x: -0.15rem; --star-drift-y: -0.25rem;',
  },
  {
    className: 'editorial-page-hero__star editorial-page-hero__star--talks',
    style:
      '--star-x: 84%; --star-y: 78%; --star-size: 0.12rem; --star-delay: 500ms; --star-drift-x: 0.2rem; --star-drift-y: -0.15rem;',
  },
] as const;

export const editorialPageHeroPresets = {
  blog: { stars: blogHeroStars },
  projects: { stars: projectsHeroStars },
  publications: { stars: publicationsHeroStars },
  talks: { stars: talksHeroStars },
  default: { stars: [] },
} satisfies Record<EditorialPageHeroVisualPreset, EditorialPageHeroPreset>;
