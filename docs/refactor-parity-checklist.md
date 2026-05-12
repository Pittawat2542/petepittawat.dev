# Refactor Parity Checklist

Use this checklist before and after behavior-preserving modernization passes. It exists to prove that structural edits kept the public site stable.

## Static Gates

- `pnpm test:content`
- `pnpm lint`
- `pnpm build` for passes that touch route rendering, Astro layouts, CSS, or build scripts

## Route Parity

Verify these routes render without console errors and keep the same visible behavior:

- `/`
- `/blog`
- one English blog post, including TOC, code blocks, tables, copy button states, related posts, and language switcher
- one Thai blog post, including language fallback/helper copy
- `/projects`
- `/publications`
- `/talks`
- `/about`
- `/404`

## Interaction Parity

- Open and close the search modal from the header trigger.
- Search from `/blog?q=...` and confirm the query, filters, sorting, and URL state stay in sync.
- Use project/publication/talk filters, sorting, and hash-target links.
- Open and close the mobile menu; verify active nav, focus-visible styles, outside click, and escape-key behavior.
- Check footer link hover and focus states.

## Screenshot Evidence

For visible UI refactors, capture desktop and narrow/mobile screenshots for every affected route before and after the pass. Treat screenshots as parity evidence, not design approval.

## Migration Boundary

Do not include dependency upgrades, framework migrations, public API removals, or visual redesigns in these refactor passes. Split those into separate migration tasks.
