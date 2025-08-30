# petepittawat.dev

Personal site of Pittawat Taveekitworachai. Built with Astro + TypeScript + React and styled with Tailwind CSS.

## Tech Stack

- Astro 5.x (static output)
- TypeScript + React islands
- Tailwind CSS
- Content Collections (MDX for blog)

## Prerequisites

- Node 18+ (LTS recommended)
- pnpm (project uses a lockfile)

## Getting Started

Install dependencies and run the dev server:

```bash
pnpm install
pnpm dev # or: pnpm start
```

Type-check and build a production bundle to `dist/`:

```bash
pnpm build        # runs astro check + build
pnpm preview      # serve the built site locally
```

Useful commands:

- `pnpm astro check` – validate Astro/TypeScript types
- `pnpm astro sync` – regenerate content types after schema changes

## Project Structure

```
src/
  pages/           # route files (Astro)
    blog/          # blog index + dynamic post routes
    tags/          # tag pages
  components/      # UI components (Astro/TSX)
  layouts/         # page/article layouts
  content/         # content collections + MDX posts
  assets/          # local images (Astro assets)
public/            # static passthrough (favicon, og/)
scripts/           # utility scripts (see below)
```

## Content

- Blog posts live under `src/content/blog` and are authored in MDX with frontmatter.
- The search index is served from `/search.json` and powers the in‑site command‑palette search.

### Search UX

- Supported pages (`/blog`, `/projects`, `/publications`, `/talks`, `/tags/*`) read `?q=` from the URL and prefill their search/filter input.
- Results linking to anchored list items (e.g., publications) include both `?q=` and a `#anchor`; the page will auto‑focus the target and, for publications, open the details modal.

## SEO & Metadata

- Canonical URLs, Open Graph, Twitter cards, and JSON‑LD (BlogPosting) are rendered in `BaseHead`/`BlogPost`.
- JSON‑LD is injected via `set:html` to ensure valid JSON for crawlers.
- RSS feed is at `/rss.xml`; a sitemap index is generated at build.

## Accessibility & UX

- Keyboard‑navigable search (⌘/Ctrl + K).
- Focus-visible outlines on interactive elements.
- Reduced‑motion media queries respected for animations.

## Scripts

- `scripts/generate-og.mjs` – prebuild step that generates OG images under `public/og/`.
- `scripts/codemod-content.mjs` – utilities to normalize legacy content (e.g., convert Markdown images to `<Figure>` in MDX). Not required for normal builds.

## Environment Variables

- `PUBLIC_TWITTER_HANDLE` (optional) – used for social metadata; define in `.env` if needed. Do not commit secrets.

## Deployment

The site is a static Astro build and can be hosted on any static platform (e.g., Vercel, Netlify, Cloudflare Pages, GitHub Pages). Build with `pnpm build` and deploy the `dist/` folder.

## Coding Guidelines

- Two‑space indentation, concise line lengths.
- Components use PascalCase; routes are kebab‑case under `src/pages/`.
- Co‑locate Tailwind classes in markup; avoid unused CSS.

## Troubleshooting

- Hydration warnings from date formatting: the project formats dates with a fixed locale/timezone to avoid SSR/CSR mismatches.
- JSON‑LD parse errors: JSON is rendered as a single serialized object; if you add new fields, keep values serializable.
- Search not prefilling: ensure you’re on a supported page and the URL contains `?q=...` before any `#anchor`.
