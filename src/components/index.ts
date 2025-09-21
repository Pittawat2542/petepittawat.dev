/**
 * Main components barrel export
 * Provides organized access to all component categories
 */

// Re-export organized component categories
export * from './common';
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
export { default as AcademicServices } from './sections/AcademicServices';

// Main component exports
export { default as AnimatedWrapper } from './AnimatedWrapper';
export { default as Callout } from './Callout';
export { default as Prose } from './Prose';
export { default as GlassCard } from './GlassCard';
export { default as GlassSurface } from './GlassSurface';
export { default as Card } from './Card';
export { default as HeroCard } from './HeroCard';
export { default as Container } from './Container';
export { default as Divider } from './Divider';
export { default as FormattedDate } from './FormattedDate';
export { default as Chip } from './Chip';
export { default as TopicChip } from './TopicChip';
export { default as ReadingProgressBar } from './ReadingProgressBar';
export { default as RelatedPosts } from './RelatedPosts';
export { default as ThemedPageHero } from './ThemedPageHero';