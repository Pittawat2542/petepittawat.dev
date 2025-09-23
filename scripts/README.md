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
