# Repository Guidelines

This document helps contributors work efficiently in this Astro + TypeScript + React project. Keep changes focused, consistent, and buildable.

## Project Structure & Module Organization
- `src/pages/`: Route files (e.g., `index.astro`, `blog/`).
- `src/components/`: Reusable UI components (`*.astro`, `*.tsx`).
- `src/layouts/`: Page layouts.
- `src/content/`: Content collections and schema (`config.ts`, `blog/`).
- `src/assets/`: Local images used via Astro assets.
- `public/`: Static passthrough files.
- `dist/`: Production build output (generated).

## Build, Test, and Development Commands
- `pnpm install`: Install dependencies.
- `pnpm dev` (alias `pnpm start`): Run dev server with HMR.
- `pnpm build`: Type-check (`astro check`) and build to `dist/`.
- `pnpm preview`: Serve the production build locally.
- `pnpm astro <cmd>`: Run Astro CLI (e.g., `pnpm astro check`).

## Coding Style & Naming Conventions
- Language: Astro + TypeScript + React; Tailwind CSS for styling.
- Indentation: 2 spaces; keep lines concise and readable.
- Components: PascalCase (e.g., `HeroCard.astro`, `BlogListPage.tsx`).
- Routes: kebab-case under `src/pages/` (URL-friendly).
- Co-locate Tailwind classes in markup; avoid unused CSS.

## Content & Pages
- Blog posts live in `src/content/blog/` as `my-post.md(x)` plus optional asset subfolder.
- Frontmatter (required): `title`, `excerpt`, `tags[]`, `pubDate`; optional `coverImage`.
- Use concise titles, meaningful slugs, and relevant tags.

## Testing Guidelines
- No unit tests currently. Validate with `pnpm build` and `pnpm astro check`.
- Manually verify core routes, RSS (`src/pages/rss.xml.js`), and sitemap.

## Commit & Pull Request Guidelines
- Commits: `<type>: <message>` (e.g., `fix: refine hero layout`). Types: `feat`, `fix`, `chore`, `docs`, `content`, `refactor`, `style`.
- Use imperative mood; reference issues/PRs when relevant (e.g., `(#5)`).
- PRs: include summary, linked issue, before/after screenshots for UI, and ensure `pnpm build` passes.

## Security & Configuration Tips
- Do not commit secrets. Use `.env` and access via `import.meta.env`.
- Node 18+ recommended for Astro 5.x. Use `pnpm`.
