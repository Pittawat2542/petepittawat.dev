# GEMINI.md - Project Context for AI Agents

## Project Overview

This is a personal website built with [Astro](https://astro.build) and Tailwind CSS. The site serves as a portfolio and blog for Pittawat Taveekitworachai, showcasing his work in research, publications, talks, and blog posts.

Key technologies used:
- [Astro](https://astro.build) - Static site generator
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript
- [React](https://reactjs.org/) - UI library for interactive components
- [MDX](https://mdxjs.com/) - Markdown with JSX

## Project Structure

```
├── src/
│   ├── assets/          # Images and static assets
│   ├── components/      # Reusable UI components
│   ├── content/         # Content collections (blog posts, publications, talks)
│   ├── layouts/         # Page layouts
│   ├── lib/             # Utility functions
│   ├── pages/           # Page routes
│   ├── styles/          # Global CSS styles
│   └── consts.ts        # Site-wide constants
├── public/              # Static files (served as-is)
├── dist/                # Production build output (generated)
└── astro.config.mjs     # Astro configuration
```

### Content Structure

The content is organized into three collections:
1. **Blog** - Markdown/MDX files in `src/content/blog/`
2. **Publications** - JSON data in `src/content/publications/publications.json`
3. **Talks** - JSON data in `src/content/talks/talks.json`

## Building and Running

### Development Commands

```bash
# Install dependencies
pnpm install

# Start local development server with hot module replacement
pnpm dev
# or
pnpm start

# Type-check and build for production
pnpm build

# Serve the production build locally
pnpm preview

# Run Astro CLI directly
pnpm astro <cmd>
```

### Key Dependencies

- `@astrojs/mdx` - Support for MDX files
- `@astrojs/react` - React integration
- `@astrojs/rss` - RSS feed generation
- `@astrojs/sitemap` - Sitemap generation
- `@astrojs/tailwind` - Tailwind CSS integration
- `astro-robots-txt` - Robots.txt generation
- `katex` - Mathematical typesetting
- `lucide-astro` - Icon library
- `sharp` - Image processing

## Development Conventions

### File Naming
- Components: PascalCase (e.g., `HeroCard.astro`)
- Routes: kebab-case (e.g., `blog/[slug].astro`)
- Assets: Descriptive names with optional subfolders

### Styling
- Use Tailwind CSS classes directly in markup
- Co-locate styles with components
- Use `glass-card` class for card components
- Use `hero-text-gradient-*` classes for gradient text effects

### Content Guidelines
Blog posts:
- Written in Markdown/MDX
- Must include frontmatter with `title`, `excerpt`, `tags[]`, and `pubDate`
- Optional `coverImage` field for featured images

Publications:
- Stored as JSON array in `publications.json`
- Each entry includes `year`, `type`, `title`, `authors`, `venue`, `url`, `artifacts`, and `tags`

Talks:
- Stored as JSON array in `talks.json`
- Each entry includes `date`, `title`, `audience`, `audienceUrl`, `mode`, `resources`, and `tags`

### Code Style
- 2-space indentation
- TypeScript for type safety
- Concise, readable code
- Use Astro's native components when possible, React for interactive elements

### Testing
- Validate via `pnpm build` and `pnpm astro check`
- Manually verify routes, RSS, and sitemap generation

## Site Features

1. **Blog** - Technical articles on programming, AI, and other topics
2. **Publications** - Academic papers and research work
3. **Talks** - Presentation history with slides and resources
4. **RSS Feed** - Available at `/rss.xml`
5. **Sitemap** - Automatically generated
6. **Responsive Design** - Mobile-friendly layout
7. **Dark Mode** - Theme toggle support

## Deployment

The site is built to the `dist/` directory and can be deployed to any static hosting service. The build process includes:
1. Type checking with `astro check`
2. Static site generation
3. Asset optimization
4. RSS and sitemap generation

## Content Management

To add new content:

### Blog Posts
1. Create a new Markdown/MDX file in `src/content/blog/`
2. Add required frontmatter fields
3. Write content using Markdown syntax
4. Include images in a subfolder if needed

### Publications
1. Add a new entry to `src/content/publications/publications.json`
2. Include all required fields (year, type, title, authors, venue, url, artifacts, tags)

### Talks
1. Add a new entry to `src/content/talks/talks.json`
2. Include all required fields (date, title, audience, audienceUrl, mode, resources, tags)