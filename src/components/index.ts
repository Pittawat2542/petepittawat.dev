/**
 * Main components barrel export
 * Provides organized access to all component categories
 */

// Re-export organized component categories
export * from './common';
export * from './content';
export * from './sections';
export * from './ui';
export * from './explorers';
export * from './header';
export * from './layout';
export * from './search';
export * from './mdx';

// Keep backwards compatibility for frequently used components
export { default as BlogCard } from './ui/cards/BlogCard';
export { default as ErrorBoundary } from './common/ErrorBoundary';
export { default as AnimatedHeader } from './common/AnimatedHeader';
export { default as AnimatedWrapper } from './common/AnimatedWrapper';
export { default as AcademicServices } from './sections/AcademicServices';

// Updated component exports from new locations
export { default as HomeCard } from './ui/core/HomeCard';
export { default as GlassCard } from './ui/core/GlassCard';
export { default as GlassSurface } from './ui/core/GlassSurface';
export { default as Container } from './ui/core/Container';
export { default as Divider } from './ui/core/Divider';
export { default as Chip } from './ui/core/Chip';
export { default as TopicChip } from './ui/core/TopicChip';
export { default as Filter } from './ui/filter/Filter';

export { default as Callout } from './content/Callout';
export { default as Prose } from './content/Prose';
export { default as FormattedDate } from './content/FormattedDate';
export { default as RelatedPosts } from './content/RelatedPosts';

export { default as HeroCard } from './layout/core/HeroCard';
export { default as ThemedPageHero } from './layout/core/ThemedPageHero';
export { default as ReadingProgressBar } from './layout/core/ReadingProgressBar';