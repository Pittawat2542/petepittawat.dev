# Site Performance and Perceived-Speed Plan

## Summary

Optimize the site for both measured speed and perceived speed on the critical public routes: home, blog index, tag pages, projects, publications, talks, and the shared layout they depend on. The main strategy is to remove avoidable first-load cost from HTML, CSS, and hydration, keep the initial screen fully usable without JavaScript, and warm up secondary interactions only on intent.

## Key Changes

### 1. Shrink first-load HTML and make assets cacheable

- Stop forcing `inlineStylesheets: 'always'` in the Astro build. Emit shared CSS as cacheable external assets so pages stop shipping large repeated inline style blocks.
- Self-host and subset the current font families instead of loading them from Google Fonts at runtime. Keep `font-display: swap`, remove the Google Fonts request chain, and define real local `@font-face` sources.
- Trim head weight where it does not improve UX or scoring: keep the favicon/manifest set required for modern browsers, avoid redundant icon declarations, and preserve current SEO/social metadata.

### 2. Re-architect listing pages as server-first with progressive enhancement

- Replace the heavy always-hydrated listing islands with server-rendered first pages plus a lightweight client enhancer.
- Keep the current user-visible behavior: search, sorting, filtering, pagination, language switching, and deep-linking still work, but the first screen must render and remain usable before the enhancer loads.
- Do not serialize full content collections into island props. Introduce compact build-time listing data objects containing only the fields needed for client filtering and sorting.
- Preserve existing URL contracts and behavior for `q`, `tag`, `sort`, `year`, `series`, and `lang`, plus existing item hash anchors.
- Default enhancement policy:
  - Home and static editorial sections: no new client JS.
  - Blog/tag/projects/publications/talks: server-render first page, hydrate controls on `client:idle` or on first interaction, whichever is lighter after measurement.
  - If a route can stay zero-JS without harming UX, prefer that.

### 3. Make secondary interactions feel instant

- Keep the search modal lazy, but prefetch its code and data on intent: hover, focus, keyboard shortcut, and optional idle warm-up on fast connections without data saver.
- Compress the search payload to the minimum searchable fields and avoid shipping unused metadata.
- Keep Astro route prefetch conservative, but add intent-based prefetch for the most common next navigations where it materially improves feel without inflating first load.

### 4. Tighten image, article, and runtime behavior

- Upgrade content figures so local images use optimized responsive assets with intrinsic dimensions; external images keep lazy loading but must reserve space to avoid CLS.
- Keep above-the-fold hero image behavior as eager/high-priority, but audit sizes so only the real LCP candidate gets priority treatment.
- Narrow broad global CSS/runtime rules that can hurt paint and compositing, especially universal selectors, blanket `transition: all`, and global rendering hints that do not need to apply site-wide.
- Preserve current motion language, but make non-essential effects defer-friendly and cheap. “Feels fast” should come from stable paint and responsive controls, not from heavier animation.

## Public Interfaces and Data Contracts

- Existing page URLs and query params stay unchanged.
- Introduce compact client-facing listing/search item types for build-time generated data:
  - Blog listing item: `id`, localized title/excerpt, URL(s), tags, date, year, series metadata, locale metadata, and sort keys.
  - Explorer item: `id`, title, summary fields, URL/hash target, tags/filter fields, date/year, and sort keys.
- Client enhancers must consume these compact types instead of full Astro content entries.

## Test Plan

- Run production build and verify generated artifact budgets improve materially:
  - critical-route HTML drops sharply, especially blog and explorer pages
  - first-load JS for critical routes excludes full dataset hydration
  - shared CSS is emitted once and cacheable
- Validate critical flows on production output:
  - home first render
  - blog index filtering, sorting, pagination, language switching
  - tag page initial render and filter continuity
  - projects/publications/talks filtering and pagination
  - search open on first click and repeated opens
  - hash deep-links still scroll to the right item
- Run Lighthouse against representative critical routes in production mode and require `100/100/100/100` on the chosen pass scope.
- Regression-check article pages with several figure-heavy posts to confirm no CLS regressions and no broken MDX media rendering.

## Assumptions and Defaults

- Scope for this pass is the critical routes, not every historical article page.
- Progressive enhancement is allowed, but UX must remain rich and snappy; this is not a “remove features to win Lighthouse” pass.
- Design language, route structure, and current content stay intact unless a specific detail directly harms performance or score ceilings.
- Service worker behavior stays unless measurement shows it is blocking a perfect score or causing stale UX.
