// Astro components in this directory are intentionally leaf-imported because
// plain TypeScript barrels do not resolve `.astro` modules in `tsc --noEmit`.
export { default as ReadingProgressBar } from './ReadingProgressBar';
export { socialLinks } from './footer-social-links';
export {
  editorialPageHeroPresets,
  type EditorialPageHeroVisualPreset,
} from './editorialPageHeroPresets';
