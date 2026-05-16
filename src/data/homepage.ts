import { ROUTES } from '@/lib/constants';

export type HeroCtaIcon = 'rocket' | 'book-open' | 'book-text' | 'scroll-text' | 'mic';
export type HeroCtaVariant = 'primary' | 'secondary' | 'ghost';

export interface HeroCtaConfig {
  readonly href: string;
  readonly title: string;
  readonly description: string;
  readonly ctaLabel: string;
  readonly variant: HeroCtaVariant;
  readonly icon: HeroCtaIcon;
}

export const HERO_CTA_CONFIG: readonly HeroCtaConfig[] = [
  {
    href: ROUTES.PUBLICATIONS,
    title: 'Publications',
    description: 'Peer-reviewed papers, preprints, and research outputs.',
    ctaLabel: 'View publications',
    variant: 'primary',
    icon: 'scroll-text',
  },
  {
    href: ROUTES.BLOG,
    title: 'Blog',
    description: 'Posts and technical essays on ideas, experiments, and lessons.',
    ctaLabel: 'Read blog',
    variant: 'secondary',
    icon: 'book-text',
  },
  {
    href: ROUTES.TALKS,
    title: 'Talks & Workshops',
    description: 'Conference talks, invited sessions, and workshop materials.',
    ctaLabel: 'Browse talks',
    variant: 'ghost',
    icon: 'mic',
  },
] as const;

export type HomeStatKey = 'posts' | 'publications' | 'talks';
export type HomeStatIcon = 'book-text' | 'scroll-text' | 'mic';

export interface HomeStatConfig {
  readonly key: HomeStatKey;
  readonly href: string;
  readonly ariaLabel: string;
  readonly title: string;
  readonly linkText: string;
  readonly accentBgColor: string;
  readonly description: string;
  readonly icon: HomeStatIcon;
}

export const HOME_STATS_CONFIG: readonly HomeStatConfig[] = [
  {
    key: 'posts',
    href: ROUTES.BLOG,
    ariaLabel: 'Read the blog',
    title: 'Blog posts',
    linkText: 'Read the blog',
    accentBgColor: 'var(--accent-blog)',
    description: 'Research breakdowns, playbooks, and engineering notes from the lab.',
    icon: 'book-text',
  },
  {
    key: 'publications',
    href: ROUTES.PUBLICATIONS,
    ariaLabel: 'View publications',
    title: 'Publications',
    linkText: 'View publications',
    accentBgColor: 'var(--accent-publications)',
    description: 'Peer-reviewed work on reasoning, prompting, and evaluation.',
    icon: 'scroll-text',
  },
  {
    key: 'talks',
    href: ROUTES.TALKS,
    ariaLabel: 'See talks',
    title: 'Talks',
    linkText: 'See talks',
    accentBgColor: 'var(--accent-talks)',
    description: 'Conference keynotes and workshops on applied LLM systems.',
    icon: 'mic',
  },
] as const;

export type HomeStats = Record<HomeStatKey, number>;
