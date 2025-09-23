# 🌟 petepittawat.dev

[![Website](https://img.shields.io/website?url=https%3A//petepittawat.dev&style=flat-square)](https://petepittawat.dev)
[![Built with Astro](https://img.shields.io/badge/Built%20with-Astro-ff5d01?style=flat-square&logo=astro)](https://astro.build)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)

Personal website and blog of **Pittawat Taveekitworachai** — a modern, fast, and accessible site showcasing academic work, publications, talks, and technical writing.

🔗 **Live Site**: [petepittawat.dev](https://petepittawat.dev)

## ✨ Features

- 📝 **Blog with MDX** - Rich content with React components
- 🔍 **Advanced Search** - Full-text search with keyboard shortcuts (⌘/Ctrl + K)
- 📊 **Publications & Research** - Academic work showcase
- 🎤 **Talks & Presentations** - Speaking engagements archive
- 🚀 **Projects Portfolio** - Technical projects and contributions
- 🌐 **Multi-content Types** - Blog posts, academic papers, talks, projects
- ⚡ **Performance Optimized** - SSG with islands architecture
- 📱 **Responsive Design** - Mobile-first with glass morphism UI
- ♿ **Accessibility First** - WCAG compliant with keyboard navigation
- 🎨 **Modern UX** - Smooth animations with reduced motion support
- 📈 **SEO Optimized** - OpenGraph, Twitter cards, JSON-LD, sitemap
- 🔄 **Auto-generated** - RSS feed and OG image generation

## 🛠️ Tech Stack

### Core Framework

- **[Astro 5.x](https://astro.build)** - Static site generation with islands architecture
- **[TypeScript](https://typescriptlang.org)** - Type-safe development
- **[React 19](https://react.dev)** - Interactive islands with React Compiler

### Styling & UI

- **[Tailwind CSS 4.x](https://tailwindcss.com)** - Utility-first styling
- **[Radix UI](https://radix-ui.com)** - Accessible component primitives
- **[Framer Motion](https://framer.com/motion)** - Smooth animations
- **[Lucide Icons](https://lucide.dev)** - Beautiful icon library

### Content & Data

- **[Content Collections](https://docs.astro.build/en/guides/content-collections/)** - Type-safe content management
- **[MDX](https://mdxjs.com)** - Markdown with React components
- **[Zod](https://zod.dev)** - Schema validation

### Development Tools

- **[ESLint](https://eslint.org)** - Code linting
- **[Prettier](https://prettier.io)** - Code formatting
- **[Sharp](https://sharp.pixelplumbing.com)** - Image optimization

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js 18+** (LTS recommended) - [Download here](https://nodejs.org)
- **pnpm** - [Install pnpm](https://pnpm.io/installation)
  ```bash
  npm install -g pnpm
  ```

> **Note**: This project uses pnpm workspace and lockfile for dependency management.

## 🚀 Getting Started

### Quick Start

1. **Clone the repository**

   ```bash
   git clone https://github.com/petepittawat/petepittawat.dev.git
   cd petepittawat.dev
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Start development server**

   ```bash
   pnpm dev
   # or alternatively:
   pnpm start
   ```

4. **Open your browser**
   Navigate to [http://localhost:4321](http://localhost:4321)

### 🏗️ Build & Preview

```bash
# Build for production
pnpm build

# Preview production build locally
pnpm preview
```

### 🔧 Development Commands

| Command                  | Description                                    |
| ------------------------ | ---------------------------------------------- |
| `pnpm dev`               | Start development server                       |
| `pnpm build`             | Build for production (includes type checking)  |
| `pnpm preview`           | Preview production build                       |
| `pnpm lint`              | Run ESLint + Astro check + TypeScript          |
| `pnpm lint:fix`          | Fix linting issues automatically               |
| `pnpm format`            | Format code with Prettier                      |
| `pnpm format:check`      | Check code formatting                          |
| `pnpm type-check`        | Run TypeScript type checking                   |
| `pnpm prepare`           | Setup Git hooks (run automatically on install) |
| `pnpm astro check`       | Validate Astro/TypeScript types                |
| `pnpm astro sync`        | Regenerate content types after schema changes  |
| `pnpm clean`             | Clean build artifacts and dependencies         |
| `pnpm generate-favicons` | Generate favicon variants                      |

## 📁 Project Structure

```
📦 petepittawat.dev/
├── 📂 public/                    # Static assets
│   ├── 🖼️ og/                   # Generated OG images
│   ├── 🌐 browserconfig.xml     # Browser configuration
│   └── ⚙️ sw.js                 # Service worker
├── 📂 scripts/                  # Build & utility scripts
│   ├── 🎨 generate-og.mjs       # OG image generation
│   ├── 🔄 codemod-content.mjs   # Content migration utilities
│   └── 📝 README.md            # Scripts documentation
├── 📂 src/
│   ├── 📂 components/           # React/Astro components
│   │   ├── 🧩 common/           # Shared components
│   │   ├── 📝 content/          # Content-related components
│   │   ├── 🔍 search/           # Search functionality
│   │   ├── 🎴 cards/            # Card components
│   │   ├── 🎛️ filter/           # Filtering components
│   │   └── 🎨 ui/               # UI component library
│   ├── 📂 content/              # Content collections
│   │   ├── 📖 blog/             # Blog posts (MDX)
│   │   ├── 📊 publications/     # Academic publications
│   │   ├── 🎤 talks/            # Speaking engagements
│   │   ├── 🚀 projects/         # Project portfolio
│   │   └── ℹ️ about/            # About page data
│   ├── 📂 pages/                # Astro route files
│   │   ├── 📝 blog/             # Blog routes
│   │   ├── 🏷️ tags/             # Tag pages
│   │   ├── 🔍 search.json.ts    # Search API endpoint
│   │   └── 📡 rss.xml.js        # RSS feed generation
│   ├── 📂 layouts/              # Page layouts
│   ├── 📂 lib/                  # Utilities & hooks
│   │   ├── 🪝 hooks/            # Custom React hooks
│   │   └── 🛠️ utils.ts          # Utility functions
│   ├── 📂 styles/               # Global styles
│   ├── 📂 types/                # TypeScript definitions
│   └── ⚙️ consts.ts             # App constants
├── 📄 astro.config.mjs          # Astro configuration
├── 🔧 tailwind.config.js        # Tailwind configuration
├── 📦 package.json              # Dependencies & scripts
└── 📝 README.md                 # Project documentation
```

## 📝 Content Management

### Content Types

This site supports multiple content types through Astro's Content Collections:

- **📖 Blog Posts** (`src/content/blog/`) - Technical articles and thoughts in MDX format
- **📊 Publications** (`src/content/publications/`) - Academic papers and research
- **🎤 Talks** (`src/content/talks/`) - Speaking engagements and presentations
- **🚀 Projects** (`src/content/projects/`) - Technical projects and contributions
- **ℹ️ About** (`src/content/about/`) - Timeline and biographical information

### Content Schema

All content is validated using Zod schemas defined in `src/content/config.ts`:

```typescript
// Blog post frontmatter
{
  title: string
  excerpt: string
  tags: string[]
  pubDate: Date
  coverImage?: ImageFunction
  // Series support
  seriesSlug?: string
  seriesTitle?: string
  seriesOrder?: number
}
```

### 🪝 Git Hooks

This project uses Husky and lint-staged to automatically format code before commits:

- **pre-commit** - Runs Prettier on staged files to ensure consistent formatting

The hook is automatically installed when you run `pnpm install`. You can manually setup the hooks with `pnpm prepare`.

### ✨ Advanced Search Features

- **🔍 Global Search** - Full-text search across all content types
- **⌨️ Keyboard Shortcuts** - Press ⌘/Ctrl + K to open search anywhere
- **🔗 URL Integration** - Search terms persist in URL (`?q=search-term`)
- **🎯 Deep Linking** - Direct links to specific content with auto-focus
- **📱 Mobile Optimized** - Touch-friendly search interface
- **⚡ Real-time Results** - Instant search as you type

#### Search-Enabled Pages

- `/blog` - Blog post search and filtering
- `/projects` - Project portfolio filtering
- `/publications` - Academic publication search
- `/talks` - Speaking engagement filtering
- `/tags/*` - Tag-based content discovery

#### Deep Linking Support

Results can link to specific content with both search context and anchors:

```
/publications?q=machine+learning#paper-123
```

This will:

1. Load the publications page
2. Filter results for "machine learning"
3. Auto-focus and highlight "paper-123"
4. Open the publication details modal

## 🔍 SEO & Metadata

### Comprehensive SEO Implementation

- **🌐 Canonical URLs** - Prevents duplicate content issues
- **📱 Open Graph** - Rich social media previews
- **🐦 Twitter Cards** - Optimized Twitter sharing
- **🏷️ JSON-LD Schema** - Structured data for search engines
- **🗺️ XML Sitemap** - Auto-generated sitemap index
- **📡 RSS Feed** - Available at `/rss.xml`
- **🖼️ OG Images** - Auto-generated social media images
- **📊 Performance** - Lighthouse score optimizations

### Schema Markup

- **BlogPosting** schema for blog articles
- **Person** schema for author information
- **Organization** schema for site identity
- **BreadcrumbList** for navigation context

### Social Media Integration

```html
<!-- Example generated meta tags -->
<meta property="og:title" content="Article Title" />
<meta property="og:description" content="Article excerpt..." />
<meta property="og:image" content="/og/article-title.png" />
<meta property="og:type" content="article" />
<meta name="twitter:card" content="summary_large_image" />
```

## ♿ Accessibility & UX

### Accessibility Features

- **⌨️ Keyboard Navigation** - Full keyboard support with logical tab order
- **🔍 Search Shortcuts** - Global search with ⌘/Ctrl + K
- **👁️ Focus Management** - Visible focus indicators on all interactive elements
- **🎬 Motion Preferences** - Respects `prefers-reduced-motion` settings
- **🎨 High Contrast** - WCAG AA compliant color ratios
- **📱 Touch Targets** - Minimum 44px touch targets for mobile
- **🔊 Screen Readers** - Semantic HTML with proper ARIA labels
- **📋 Skip Links** - Quick navigation for keyboard users

### Performance Optimizations

- **⚡ Static Generation** - Zero runtime JavaScript for content
- **🏝️ Islands Architecture** - Minimal client-side hydration
- **📦 Code Splitting** - Optimized bundle chunks
- **🖼️ Image Optimization** - WebP/AVIF with responsive sizing
- **🗜️ Compression** - Brotli/Gzip compression enabled
- **🔄 Caching** - Aggressive caching strategies
- **📊 Metrics** - Core Web Vitals optimized

### User Experience

- **🎨 Glass Morphism** - Modern visual design system
- **🌙 Theme Support** - System theme preference detection
- **📱 Mobile First** - Responsive design from mobile up
- **🔄 Progressive Enhancement** - Works without JavaScript
- **⚡ Instant Navigation** - Fast page transitions
- **🎯 Smart Defaults** - Intuitive interface patterns

## 🔧 Build Scripts

### Automated Scripts

#### 🎨 OG Image Generation (`scripts/generate-og.mjs`)

- **Purpose**: Generates social media preview images
- **Trigger**: Runs automatically during `prebuild`
- **Output**: Creates optimized images in `public/og/`
- **Features**:
  - Dynamic text rendering
  - Brand-consistent styling
  - Multiple size variants
  - Automatic optimization

#### 🔄 Content Migration (`scripts/codemod-content.mjs`)

- **Purpose**: Normalizes and migrates legacy content
- **Usage**: Manual execution for content updates
- **Features**:
  - Converts Markdown images to `<Figure>` components
  - Updates frontmatter schema
  - Batch content transformations
  - Backup creation before changes

#### 📱 Favicon Generation (`scripts/generate-favicons.sh`)

- **Purpose**: Creates all favicon variants and platform icons
- **Output**: Multiple sizes and formats for different devices
- **Usage**: `pnpm generate-favicons`

### Development Workflow

```bash
# Complete build process
pnpm install          # Install dependencies
pnpm prebuild         # Generate OG images
pnpm build            # Type check + build
pnpm preview          # Test production build
```

## 🔐 Environment Variables

Configuration is handled through environment variables. Create a `.env` file in the project root:

```bash
# Social Media Integration (Optional)
PUBLIC_TWITTER_HANDLE=@yourusername

# Analytics (Optional)
PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
PUBLIC_PLAUSIBLE_DOMAIN=yourdomain.com

# Development (Optional)
DEV_PORT=4321
```

> **⚠️ Security Note**: Never commit sensitive credentials to version control. Use `.env.local` for local secrets and configure environment variables in your deployment platform.

## 🚀 Deployment

### Static Hosting Platforms

This site generates a static build and can be deployed to any static hosting platform:

#### Recommended Platforms

- **[Vercel](https://vercel.com)** - Zero-config deployment from Git
- **[Netlify](https://netlify.com)** - Continuous deployment with edge functions
- **[Cloudflare Pages](https://pages.cloudflare.com)** - Global CDN with serverless functions
- **[GitHub Pages](https://pages.github.com)** - Free hosting for public repositories

#### Deployment Configuration

**Build Settings:**

```bash
Build Command: pnpm build
Output Directory: dist/
Node Version: 18.x or higher
```

**Environment Variables:**
Ensure you set your environment variables in your deployment platform's dashboard.

### Manual Deployment

```bash
# Build the site
pnpm build

# Deploy the dist/ folder to your hosting provider
# Example with rsync:
rsync -avz --delete dist/ user@server:/path/to/web/root/
```

## 📏 Coding Guidelines

### Code Style

- **Indentation**: 2 spaces (configured in `.editorconfig`)
- **Line Length**: Aim for concise lines, soft limit around 100 characters
- **Quotes**: Single quotes for JavaScript/TypeScript, double quotes for JSX attributes
- **Semicolons**: Always use semicolons

### File Organization

- **Components**: Use PascalCase (`MyComponent.tsx`)
- **Pages**: Use kebab-case (`about-me.astro`)
- **Utilities**: Use camelCase (`formatDate.ts`)
- **Constants**: Use UPPER_SNAKE_CASE (`API_ENDPOINTS`)

### Component Guidelines

- Co-locate styles with components using Tailwind classes
- Prefer composition over inheritance
- Use TypeScript interfaces for props
- Export components from index files for clean imports
- Keep components focused and single-purpose

### Content Guidelines

- Use semantic HTML elements
- Include alt text for all images
- Write descriptive link text
- Structure content with proper heading hierarchy

## 🐛 Troubleshooting

### Common Issues

#### Hydration Warnings

**Issue**: Date formatting causing SSR/CSR mismatches
**Solution**: The project uses fixed locale/timezone for date formatting to prevent hydration issues.

#### JSON-LD Parse Errors

**Issue**: Invalid JSON in structured data
**Solution**: JSON-LD is rendered as a single serialized object. Ensure all values are serializable when adding new fields.

#### Search Not Prefilling

**Issue**: Search doesn't auto-populate from URL parameters
**Solution**:

- Ensure you're on a supported page (`/blog`, `/projects`, `/publications`, `/talks`, `/tags/*`)
- Check that URL contains `?q=...` parameter
- Verify parameter comes before any `#anchor` in the URL

#### Build Failures

**Issue**: TypeScript or Astro build errors
**Solution**:

```bash
# Clear cache and rebuild
pnpm clean
pnpm install
pnpm astro sync
pnpm build
```

#### Performance Issues

**Issue**: Slow development server or build times
**Solution**:

```bash
# Clear Astro cache
rm -rf .astro
# Clear node_modules and reinstall
pnpm clean
pnpm install
```

### Debug Commands

```bash
# Check TypeScript types
pnpm type-check

# Validate Astro configuration
pnpm astro check

# Lint code
pnpm lint

# Format code
pnpm format

# Generate type definitions
pnpm astro sync
```

## 🤝 Contributing

While this is a personal website, contributions are welcome! Here's how you can help:

### Ways to Contribute

- 🐛 **Bug Reports** - Found an issue? Open an issue with details
- 💡 **Feature Suggestions** - Have an idea? Start a discussion
- 📝 **Documentation** - Help improve this README or code comments
- 🔧 **Code Improvements** - Performance optimizations, accessibility enhancements

### Development Process

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
   - Follow the coding guidelines
   - Add tests if applicable
   - Update documentation
4. **Test your changes**
   ```bash
   pnpm lint
   pnpm type-check
   pnpm build
   ```
5. **Commit your changes**
   ```bash
   git commit -m "Add amazing feature"
   ```
6. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Commit Conventions

We follow [Conventional Commits](https://conventionalcommits.org/):

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `perf:` - Performance improvements
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **[Astro Team](https://astro.build)** - For the amazing static site generator
- **[Vercel](https://vercel.com)** - For seamless deployment and hosting
- **[Tailwind CSS](https://tailwindcss.com)** - For the utility-first CSS framework
- **[Radix UI](https://radix-ui.com)** - For accessible component primitives
- **Open Source Community** - For the incredible tools and libraries

---

<div align="center">

**Built with ❤️ by [Pittawat Taveekitworachai](https://petepittawat.dev)**

[Website](https://petepittawat.dev) • [Twitter](https://twitter.com/petepittawat) • [LinkedIn](https://linkedin.com/in/pittawat)

</div>
