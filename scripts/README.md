# Scripts

This directory contains utility scripts for the project.

## `generate-favicons.sh`

Converts the `public/favicon.svg` file to all necessary favicon formats for comprehensive browser and device support.

### Requirements

- ImageMagick (install with `brew install imagemagick`)

### Usage

```bash
# Run the script directly
./scripts/generate-favicons.sh

# Or use the npm script
npm run generate-favicons
```

### Generated Files

The script generates the following files in the `public/` directory:

#### Standard Favicons

- `favicon.ico` (multi-size ICO file)
- `favicon-16x16.png`
- `favicon-32x32.png`

#### Apple Touch Icons

- `apple-touch-icon.png` (180×180, main Apple touch icon)
- `apple-touch-icon-precomposed.png` (180×180, precomposed version)
- Various sizes: 57×57, 60×60, 72×72, 76×76, 114×114, 120×120, 144×144, 152×152

#### Android/Chrome Icons

- `android-chrome-192x192.png`
- `android-chrome-512x512.png`

#### Microsoft Tile Icons

- `mstile-70x70.png`
- `mstile-144x144.png`
- `mstile-150x150.png`
- `mstile-310x150.png`
- `mstile-310x310.png`

#### Configuration Files

- `site.webmanifest` (PWA manifest)
- `browserconfig.xml` (Microsoft tiles configuration)

### Notes

- The script creates a temporary high-resolution PNG from the SVG for better conversion quality
- All PNG files are generated with transparent backgrounds
- The script includes comprehensive error checking and colored output
- Generated files are automatically included in the build process via Astro

### HTML Integration

The generated favicons are automatically included in your HTML via the `BaseHead.astro` component, which contains comprehensive `<link>` and `<meta>` tags for all supported formats.

## `update-dependencies.mjs`

Runs dependency upgrades in explicit groups instead of a single blanket update.

### Behavior

- Prints `pnpm outdated` first so you can review available updates
- Upgrades Astro core, runtime packages, and tooling in separate steps
- Verifies each step with `pnpm lint` and `pnpm build`
- Leaves review and commit decisions to the caller after the grouped run completes

### Usage

```bash
pnpm update-deps
```

## `translate-blog-post.mjs`

Translates a blog post MDX source into its English or Thai sibling using NVIDIA NIM chat completions, then writes the translated file directly into `src/content/blog/en/` or `src/content/blog/th/`.

### Behavior

- Reads the full source MDX file, including frontmatter.
- Preserves MDX structure, imports, components, links, images, code fences, and metadata shape.
- Translates the title, excerpt, and reader-visible prose into the target language.
- Writes the translated sibling file directly.
- Normalizes the source file first when needed by adding explicit `lang` and `translationId` metadata for bilingual pairing.
- Uses `routeSlug` plus language-specific internal slugs so English and Thai variants can share the same public route slug without Astro content ID collisions.

### Requirements

- Create a `.env` file in the project root. You can start from `.env.example`.
- Required:
  - `NVIDIA_NIM_API_KEY`
- Optional:
  - `NVIDIA_NIM_MODEL` to override the default model.
  - `NVIDIA_NIM_API_URL` to override the chat completions endpoint.

### Usage

```bash
# Translate an English post into Thai
pnpm translate-blog-post -- src/content/blog/wisdom.mdx th

# Translate a Thai post into English
pnpm translate-blog-post -- src/content/blog/th/the-silicon-mind.mdx en

# Preview generated MDX without writing files
pnpm translate-blog-post -- src/content/blog/wisdom.mdx th --dry-run

# Replace an existing target translation
pnpm translate-blog-post -- src/content/blog/wisdom.mdx th --overwrite
```

### Default transport

- Endpoint: `https://integrate.api.nvidia.com/v1/chat/completions`
- Default model: `moonshotai/kimi-k2.6`
- The script sends one `system` message with translation rules and one `user` message containing the full MDX source.
- The model is instructed to return a single JSON object with `title`, `excerpt`, and `bodyMdx`.
- The script automatically loads `.env` from the repo root before reading these settings.

### Output conventions

- Public URLs stay language-scoped:
  - English: `/blog/<route-slug>/`
  - Thai: `/th/blog/<route-slug>/`
- The translated file is stored as:
  - `src/content/blog/en/<route-slug>.mdx`
  - `src/content/blog/th/<route-slug>.mdx`
- The translated frontmatter uses:
  - `slug: '<route-slug>-en'` or `slug: '<route-slug>-th'`
  - `routeSlug: '<route-slug>'`
  - shared `translationId`
