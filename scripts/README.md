# Scripts

This directory contains utility scripts for the project.

## Cover and hero images

`pnpm generate:content-images` exports the shared site cover, project/publication/talk
cards, and blog sharing images, then validates their dimensions. It also runs before
each build. All derivatives are 1200×630, with orientation corrected and colors
converted to sRGB. See [Sharp's resize documentation](https://sharp.pixelplumbing.com/api-resize/).

- `generate-site-cover.ts` exports `public/visual/site/home-cover.png` to the
  default sharing image, `public/home-og-image.jpeg`, using quality 94 and 4:4:4
  chroma sampling to preserve typography and colored edges.
- `generate-card-visuals.ts` prefers a `.png` source beside each `.webp` output in
  `public/visual/cards/`. Cards use WebP quality 90. When no source exists, the
  deterministic SVG is rasterized at twice the output resolution and downsampled
  for smoother fine lines.
- `generate-og.ts` derives lossless blog sharing PNGs from each post's
  `coverImage`. English and Thai variants continue to share their source artwork.

Caches track source image bytes and metadata separately from the export version.
Replacing or removing source artwork regenerates its derivative on the next run.
Existing archive images retain their bytes and timestamps when only export
settings change; new items and changed artwork use the latest settings. Older
manifests are migrated by recording an input hash without re-exporting their
images. Increment `CONTENT_IMAGE_VERSION` in `content-image.ts` whenever export
settings change. To explicitly re-export an archive later, pass `--refresh` to
`scripts/generate-card-visuals.ts` or `scripts/generate-og.ts`.

### Refresh the site cover

```bash
# Print the art direction and exact copy, using current site metadata
pnpm prompt:site-cover

# After replacing the source PNG, export the production image
pnpm generate:site-cover
```

Use the printed prompt with the built-in image generation tool, supplying
`src/assets/images/logo.png` as the brand reference (and the original cover when
available for its vivid cyan-blue and black colors). Review spelling,
thumbnail legibility, safe margins, and composition before saving the selected
image to `public/visual/site/home-cover.png`. Prefer a source at least 1200×630
in a 1.905:1 aspect ratio; the prompt requests 2400×1260 when available. Save the
actual prompt beside it as `home-cover.prompt.txt` for future revisions. The
current cover was generated using the built-in tool, with the original blue logo
beside the site wordmark, the theme “Research. Build. Understand.”, and a glass
orbital sculpture on a midnight navy backdrop.
Builds only export the approved artwork; they do not call an image generation API.

For individual content covers, base the visual concept on the article, project,
paper, or talk rather than its first tag alone. Choose one recognizable subject,
use restrained lighting and a clear focal point, and keep important details within
the central safe area. Blog heroes have HTML titles over the left side, so keep
that area quiet and avoid duplicating their title in the image. Save replacement
blog artwork at its frontmatter `coverImage` path; save replacement card artwork
as the PNG beside its existing WebP, then run `pnpm generate:content-images`.

Run `node --test scripts/content-image.test.ts` to check source-change
invalidation, skipping, fallback recovery, and output dimensions.

## `generate-favicons.sh`

Converts the `public/favicon.svg` file to all necessary favicon formats for comprehensive browser and device support.

### Requirements

- ImageMagick (install with `brew install imagemagick`)

### Usage

```bash
# Run the script directly
./scripts/generate-favicons.sh

# Or use the pnpm script
pnpm generate-favicons
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
- Skips the translation cleanly when the target file already exists, unless `--overwrite` is passed.
- Normalizes the source file first when needed by adding explicit `lang` and `translationId` metadata for bilingual pairing.
- Uses `routeSlug` plus language-specific internal slugs so English and Thai variants can share the same public route slug without Astro content ID collisions.
- Prints concise progress lines for source resolution, skip/write decisions, model request, and final output path.

### Requirements

- Create a `.env` file in the project root. You can start from `.env.example`.
- Required:
  - `NVIDIA_NIM_API_KEY`
- Optional:
  - `NVIDIA_NIM_MODEL` to override the default model.
  - `NVIDIA_NIM_API_URL` to override the chat completions endpoint.
  - `NVIDIA_NIM_TIMEOUT_MS` to override the request timeout in milliseconds.

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
- Default timeout: `1800000` ms
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
