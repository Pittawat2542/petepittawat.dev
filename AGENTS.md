# Repository Guidelines

This guide helps contributors work efficiently in this Astro + TypeScript + React project. Keep changes focused, consistent, and buildable.

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

- **Language**: Astro + TypeScript + React; Tailwind CSS for styling.
- **Indentation**: 2 spaces; keep lines concise and readable.
- **Components**: PascalCase (e.g., `HeroCard.astro`, `BlogListPage.tsx`).
- **Routes**: kebab-case under `src/pages/` for URL-friendly paths.
- **Styles**: Co-locate Tailwind classes in markup; avoid unused CSS.

## Testing Guidelines

- No unit tests currently.
- Validate types/build: `pnpm build` (runs `astro check`).
- Manual checks: core routes, RSS (`src/pages/rss.xml.js`), and sitemap via `pnpm preview`.

## Commit & Pull Request Guidelines

- **Commits**: `<type>: <message>` (e.g., `fix: refine hero layout`). Types: `feat`, `fix`, `chore`, `docs`, `content`, `refactor`, `style`.
- **Style**: Imperative mood; reference issues/PRs when relevant (e.g., `(#5)`).
- **PRs**: Provide a summary, linked issue, before/after screenshots for UI, and ensure `pnpm build` passes.

## Security & Configuration Tips

- Do not commit secrets. Use `.env` and access via `import.meta.env`.
- Use Node 18+ for Astro 5.x; use `pnpm` to match the lockfile.
