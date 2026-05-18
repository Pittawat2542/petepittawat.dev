# Frontend Style Debt Audit

This document tracks the highest-risk frontend style architecture debt currently visible in the repository.

It is not a complete style inventory. It is a prioritized cleanup program intended to reduce silent rendering failures and unclear CSS ownership.

## Audit Method

Files were prioritized using a combination of:

- Astro scoping complexity
- file size
- cross-component CSS ownership
- number of global selectors
- likelihood that a visual change can pass static checks while still rendering incorrectly

## Bucket 1: Immediate Cleanup Candidates

These files should be cleaned up first because they combine broad runtime impact with unclear style ownership.

### `src/layouts/BlogPost.astro`

Status: first ownership cleanup pass completed.

What changed:

- the layout now keeps article shell placement, the back link, the main grid, and related-section placement
- hero visuals live with `src/components/layout/blog-post/ArticleHero.astro`
- rail visuals live with `src/components/layout/blog-post/ArticleRail.astro`
- prose and code-block visuals live with `src/components/layout/blog-post/ArticleBody.astro`
- the shared card surface lives in `src/styles/components/article-surface.css`

Remaining review target:

- keep the layout from regaining child component visuals
- keep `article-surface.css` limited to the shared surface shell only
- verify rendered parity for long posts with TOC, code blocks, tables, related posts, and language switching

### First cleanup tranche paired files

These files participate in the blog-post ownership boundary:

- `src/components/layout/blog/Toc.astro`
- `src/components/content/RelatedPosts.tsx`
- `src/components/layout/blog-post/ArticleHero.astro`
- `src/components/layout/blog-post/ArticleRail.astro`
- `src/components/layout/blog-post/ArticleBody.astro`

Cleanup target:

- define clear ownership boundaries between layout placement and component visuals
- ensure interactive states live with the component that renders them

## Bucket 2: Shared UI Shell Review

These files are not the highest-risk failures today, but they are shared enough that style ownership should be reviewed deliberately.

### Runtime typography drift

Status: systematized in the typography scale pass.

What changed:

- runtime font sizes now route through `--type-*` tokens or semantic `type-*` utilities
- Tailwind text utilities are backed by the project scale in `src/styles/global.css`
- `src/styles/typography.architecture.test.ts` blocks new raw numeric runtime font sizes and numeric arbitrary `text-[...]` utilities

Remaining review target:

- keep exceptions limited to fixed-canvas generation code, embedded article assets, and non-runtime content illustrations
- prefer semantic utilities for repeated roles instead of adding new component-local token aliases

### `src/components/layout/core/Footer.astro`

Why it is risky:

- it uses `:global(...)` to style icon classes inside a scoped style block
- the pattern is valid, but it deserves review because it can spread global-style habits into other shared shells

Cleanup target:

- keep the documented `:global(.site-footer__icon)` escape local to the footer class namespace
- avoid moving footer icon styling into shared/global CSS unless another footer-like surface actually reuses it

### `src/components/header/MobileMenu.astro`

Why it is risky:

- it is one of the largest component-level `.astro` files
- it combines toggle behavior, overlay, sheet, panel, and link styling in one surface
- if more states are added, ownership boundaries could blur quickly

Cleanup target:

- keep the component scoped and self-owned
- consider splitting toggle, panel shell, and link card concerns if the file keeps growing

## Bucket 3: Lower-Risk Consistency Review

These are not urgent, but they should be reviewed as follow-up work to keep the architecture coherent.

### `src/components/header/SiteLogo.astro`

Why it is on the list:

- it is style-heavy and visually distinctive
- it appears self-contained today, but it should remain colocated and not leak into shared global patterns

Cleanup target:

- confirm that all effect-layer styling remains local to the logo
- keep any future shared token extraction limited to colors, spacing, or motion variables

### `src/styles/components/*`

Why it is on the list:

- the directory is the correct home for genuinely shared component styles
- it becomes risky if page-specific or single-component styling drifts into it

Cleanup target:

- review each file and confirm it styles a truly shared surface
- move one-off styles back to component-local ownership when they are not broadly reused

## Cleanup Order

1. Keep `src/layouts/BlogPost.astro` from regaining child visuals.
2. Keep runtime typography on the shared `--type-*` scale and update the architecture test allowlist only for real exceptions.
3. Review `src/components/layout/blog/Toc.astro` for whether its global style block can be scoped in a later focused pass.
4. Keep `src/components/content/RelatedPosts.tsx` paired with `src/styles/components/related-posts.css`.
5. Keep the documented footer icon escape local to `src/components/layout/core/Footer.astro`.
6. Review `src/components/header/MobileMenu.astro` only when adding new menu states or behavior.
7. Keep `src/components/header/SiteLogo.astro` self-contained.
8. Review `src/styles/components/*` when a stylesheet gains a second unrelated responsibility.

## Acceptance Criteria for Each Cleanup PR

Every cleanup PR should:

- reduce styling owned by a parent layout over child component internals
- use one Astro style-scoping model per file
- keep shared styles limited to shared surfaces
- pass `pnpm lint`
- pass `pnpm build`
- include desktop and narrow/mobile screenshots for changed UI
- mention the component ownership boundary that was clarified
