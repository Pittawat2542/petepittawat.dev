# Repository Guidelines

## Project Structure & Module Organization
- `src/pages/`: Route files (e.g., `index.astro`, `blog/`).
- `src/components/`: Reusable UI components (`*.astro`, `*.tsx`).
- `src/layouts/`: Page layouts.
- `src/content/`: Content collections and schema (`config.ts`, `blog/` MD/MDX + assets).
- `src/assets/`: Local images used via Astro assets.
- `public/`: Static passthrough files (served as-is).
- `dist/`: Production build output (generated).

## Build, Test, and Development Commands
- `pnpm install`: Install dependencies.
- `pnpm dev` (alias: `pnpm start`): Run local dev server with HMR.
- `pnpm build`: Type-check (`astro check`) and build to `dist/`.
- `pnpm preview`: Serve the production build locally.
- `pnpm astro <cmd>`: Run Astro CLI directly (e.g., `pnpm astro check`).

## Coding Style & Naming Conventions
- Use Astro + TypeScript + React as present in the repo.
- Prefer 2-space indentation; keep lines focused and readable.
- Components: PascalCase (`HeroCard.astro`, `BlogListPage.tsx`).
- Routes: kebab-case for folders/files under `src/pages/` (URL-friendly).
- Tailwind CSS for styling; co-locate classes in markup.
- Run `pnpm build` before PRs to catch type/content errors.

## Content & Pages
- Blog posts live in `src/content/blog/` as `my-post.md(x)` plus optional asset subfolder.
- Frontmatter schema (required): `title`, `excerpt`, `tags[]`, `pubDate`; optional `coverImage`.
- Use concise titles, meaningful slugs, and relevant tags.

## Testing Guidelines
- No unit tests currently. Validate via `pnpm build` and `pnpm astro check`.
- Manually verify routes, RSS (`src/pages/rss.xml.js`), and sitemap generation.

## Commit & Pull Request Guidelines
- Commit style: `<type>: <message>` (e.g., `fix: refine hero layout`, `chore: bump deps`).
- Common types: `feat`, `fix`, `chore`, `docs`, `content`, `refactor`, `style`.
- Use imperative mood; reference issues/PRs when relevant (e.g., `(#5)`).
- PRs: include summary, linked issue, before/after screenshots for UI, and `pnpm build` passing.

## Security & Configuration Tips
- Do not commit secrets. Use `.env` and reference via `import.meta.env` when needed.
- Node 18+ recommended for Astro 5.x. Use `pnpm` (project default).
