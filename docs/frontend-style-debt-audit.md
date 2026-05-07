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

Why it is risky:

- it is the largest `.astro` file in the repo at 1400+ lines
- it uses `<style is:global>`
- it also contains many `:global(...)` selectors in the same file
- it styles multiple sub-systems from one place:
  - article shell
  - prose treatment
  - TOC visuals
  - related-post card visuals

Cleanup target:

- keep page shell, section placement, and article-level spacing in the layout
- move TOC visuals to `src/components/layout/blog/Toc.astro` or a colocated TOC stylesheet
- move related-post visuals closer to `src/components/content/RelatedPosts.tsx`
- normalize Astro scoping usage so the file uses one scoping model consistently

### First cleanup tranche paired files

These files should be cleaned up together with `BlogPost.astro` because they currently participate in split ownership:

- `src/components/layout/blog/Toc.astro`
- `src/components/content/RelatedPosts.tsx`

Cleanup target:

- define clear ownership boundaries between layout placement and component visuals
- ensure interactive states live with the component that renders them

## Bucket 2: Shared UI Shell Review

These files are not the highest-risk failures today, but they are shared enough that style ownership should be reviewed deliberately.

### `src/components/layout/core/Footer.astro`

Why it is risky:

- it uses `:global(...)` to style icon classes inside a scoped style block
- the pattern is valid, but it deserves review because it can spread global-style habits into other shared shells

Cleanup target:

- confirm whether icon styling can stay local to the footer without global escapes
- document any remaining escape as intentional and component-owned

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

1. `src/layouts/BlogPost.astro`
2. `src/components/layout/blog/Toc.astro`
3. `src/components/content/RelatedPosts.tsx`
4. `src/components/layout/core/Footer.astro`
5. `src/components/header/MobileMenu.astro`
6. `src/components/header/SiteLogo.astro`
7. `src/styles/components/*`

## Acceptance Criteria for Each Cleanup PR

Every cleanup PR should:

- reduce styling owned by a parent layout over child component internals
- use one Astro style-scoping model per file
- keep shared styles limited to shared surfaces
- pass `pnpm lint`
- pass `pnpm build`
- include desktop and narrow/mobile screenshots for changed UI
- mention the component ownership boundary that was clarified
