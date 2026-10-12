# Static listing performance

Blog, tag, project, publication, and talk cards render during the Astro build. The browser reads compact filter metadata and moves existing card nodes; it does not hydrate cards or calculate artwork. One native dialog per listing clones inert, build-rendered detail templates. Search loads React, Radix, its styles, and the shared index only after search intent.

English blog cards are present in the HTML. Thai cards use one shared fragment whose directory name hashes the rendered HTML, including its asset URLs. URL language preferences take precedence over storage. Failed language and search requests leave a retry control. No runtime server is needed; the GitHub Pages workflow and custom domain are retained.

## Build budgets

`pnpm build` runs `scripts/performance/audit-build.mjs` after Astro finishes. `pnpm audit:performance` can check an existing build. The audit includes inline runtime scripts and follows static JavaScript imports and module preloads on `/blog/`, `/tags/ai/`, `/projects/`, `/publications/`, and `/talks/` and requires:

- Less than 20 KiB gzip of initial JavaScript, with no React or Radix in that dependency graph.
- No hydrated listing/search islands in initial HTML.
- Initial external CSS at or below the previous 268,394-byte listing baseline.
- Every blog cover's largest WebP variant at least 70% smaller than its original PNG, with responsive sources and dimensions.
- A valid content hash for the alternate-language fragment, no fragment URLs in the sitemap, and working search-result anchors.
- The existing custom domain and social preview assets.

Measurements on 2026-10-12, compared with commit `5b06bc7`:

| Asset                                             |         Before |               After |
| ------------------------------------------------- | -------------: | ------------------: |
| Blog startup JS, including idle listing hydration | 150.2 KiB gzip |        9.7 KiB gzip |
| Listing CSS                                       |      262.1 KiB |           251.0 KiB |
| Blog HTML                                         |  62.5 KiB gzip | about 41.3 KiB gzip |
| Blog cover downloads, summed largest variants     |  Original PNGs |       95.7% smaller |

Publication/project/talk HTML grows because complete dialog contents now ship as inert templates. Removing hydration and the vendor bundle still reduces startup downloads. Original image sources, social previews, and downloadable resources remain available.

Cover transforms are cached across listing, tag, homepage, and article builds. Widths are 400, 800, and 1200 pixels, capped at source resolution, using WebP quality 80. The initial featured cover is eager; later covers are lazy and use [`sizes="auto"`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/sizes) to follow their actual layout, with fallback sizes for older browsers. Full-width article hero hints match their preloads. Cards after the first grid row use `content-visibility: auto` and remembered intrinsic block sizes. Wrapper padding reserves space for focus rings.

## Browser measurements

Run the local diagnostic server with:

```sh
node scripts/performance/serve-benchmark.mjs dist 4330 --mobile
```

Open `/blog/` or `/__performance/500/` at a 390 × 844 viewport and use **Measure filters**. The server applies a shared 1.6 Mbps bandwidth limit, 150 ms request latency, gzip for text, and no browser cache. The 500-card fixture repeats the production cards with unique metadata IDs before the controller starts. The previous build used the same 500-entry content fixture with its React renderer.

| Scenario        | Before interactive | After interactive | Before slowest filter | After slowest filter |
| --------------- | -----------------: | ----------------: | --------------------: | -------------------: |
| Blog, 60 cards  |           3,933 ms |            767 ms |               36.3 ms |              26.0 ms |
| Blog, 500 cards |           3,260 ms |          1,191 ms |              238.8 ms |              73.5 ms |

The corresponding mobile LCP samples were 952 → 772 ms and 1,176 → 1,116 ms. These are individual local in-app browser runs, not statistical device benchmarks. There is **no CPU slowdown**. Filter timings cover twelve alternating queries and include two animation frames after the result count changes, so they include a visible paint. They are diagnostic measurements, separate from deterministic CI budgets.

Additional diagnostic modes:

- `/__nojs/blog/` and `/__nojs/tags/ai/` remove all scripts to inspect the server-rendered content. The AI tag page has 9 matching cards initially; all 60 cards remain in the document.
- **Find last card** exercises the browser's text-search engine. It successfully found and revealed the last offscreen card under containment.
- `--fail-first` rejects the first language request and rejects search-index requests until `/__performance/recover-search` is requested. Retry controls were verified for both.
- `--fail-module` rejects the deferred search module until recovery is enabled. Its visible retry button reloads the current URL and resumes search; filter parameters and anchors are preserved.
- `--delay-header` pauses the header module in the fixture to exercise search intent captured before initialization.
- `--reduced-motion` forces the reduced-motion stylesheet rules and media-query branch in the local fixture. Publication deep links scrolled instantly, with animations disabled. The OS preference was not changed.
- `?screenshot=1` omits the diagnostic overlay for visual comparison.

Desktop (1440 × 1000) and mobile (390 × 844) captures are saved locally in `output/playwright/`, including `blog-before-desktop.jpg`, `blog-after-desktop.jpg`, `blog-before-mobile.jpg`, and `blog-after-mobile.jpg`. Additional captures cover search, publication deep links, browser Find, no-JavaScript tag defaults, and card focus. The directory is ignored by Git.

Browser checks covered search/filter empty states and clearing, sort typeahead, tag search/counts and arrow navigation, Escape and focus return, locale preference precedence and retry, back navigation, current and legacy publication anchors, repeated deep links, project/talk dialogs and resources, and focus outlines on contained cards. Featured and grid title font sizes and line spacing were compared with the previous build. The production preview reported no browser errors.

## Validation

- `pnpm test:content`: 86 tests pass, including listing filtering, sorting, route defaults, URL preservation, legacy publication anchors, and series metadata. Existing translation tests cover fallback behavior.
- `pnpm lint`: ESLint, Astro diagnostics, and TypeScript checks.
- `pnpm build`: content-image validation, Astro diagnostics, full static generation, responsive image transforms, fragment hashing, and asset budgets.
