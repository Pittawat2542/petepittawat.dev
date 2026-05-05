# i18n Content Guidelines

## Non-blog canonical copy

- Canonical non-blog copy lives in `src/data/site/copy.ts`.
- Shared site content is English-only.
- English is the authored source for navigation, layout text, metadata, and other global UI.
- Longer editorial copy belongs in the site copy module, not in `src/i18n/ui.ts`.
- `src/i18n/ui.ts` should stay focused on short UI labels and status strings.

## Blog translation conventions

- Keep `lang` on every blog post frontmatter entry.
- Keep `translationId` as the durable mapping key between localized variants.
- Language switching is only supported on individual blog posts that have both language variants.
- Posts without a sibling translation stay single-language and should not render translation controls.
- Treat English as the canonical source text for future scripted translation unless a post is intentionally Thai-first.
- Localized `title`, `excerpt`, and `slug` may differ by language.
- The pairing key is `translationId`, not filename similarity.

## Recommended structure going forward

- All blog posts should live under `src/content/blog/en/` or `src/content/blog/th/`.
- Root-level `src/content/blog/*.mdx` files are considered legacy drift and should be migrated rather than extended.
- Every bilingual pair should keep the same `translationId` and `routeSlug`.
- Use locale-specific internal slugs such as `<route-slug>-en` and `<route-slug>-th` to avoid Astro content ID collisions.
- Local asset references in frontmatter or MDX imports should be written relative to the locale folder, for example `../my-post/cover.jpeg`.
