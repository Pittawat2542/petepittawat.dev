import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

import sharp from 'sharp';

import {
  SITE_TITLE,
  getBlogCoverDecorationSpec,
  getBlogCoverTextLayout,
  resolveBlogCoverSpec,
  type BlogCoverDecorationLayer,
  type BlogCoverDecorationTone,
  type BlogCoverLocale,
  type BlogCoverSpec,
  type BlogCoverViewport,
} from '../src/lib/blog-cover/index.ts';

const ROOT = process.cwd();
const BLOG_DIR = path.join(ROOT, 'src', 'content', 'blog');
const PUBLIC_DIR = path.join(ROOT, 'public');
const MANIFEST_FILE = path.join(ROOT, 'public', 'og', 'manifest.json');
const RENDER_VERSION = 'blog-cover-v9';

type BlogFrontmatter = {
  title: string;
  excerpt: string;
  lang: BlogCoverLocale;
  routeSlug: string;
  tags: string[];
  pubDate?: string | undefined;
};

const ogViewport: BlogCoverViewport = {
  width: 1200,
  height: 630,
  variant: 'og',
};

await generate();

async function generate() {
  const [files, manifest, logoDataUrl] = await Promise.all([
    collectContentFiles(BLOG_DIR),
    loadManifest(),
    readLogoDataUrl(),
  ]);

  const updatedManifest: Record<string, { hash: string; generatedAt: string }> = {};
  let generatedCount = 0;
  let skippedCount = 0;

  for (const file of files) {
    const content = await fs.readFile(file, 'utf8');
    const frontmatter = extractFrontmatter(content);
    if (!frontmatter) {
      continue;
    }

    const spec = resolveBlogCoverSpec({
      title: frontmatter.title,
      excerpt: frontmatter.excerpt,
      lang: frontmatter.lang,
      routeSlug: frontmatter.routeSlug,
      tags: frontmatter.tags,
      pubDate: frontmatter.pubDate,
    });

    const outPath = path.join(PUBLIC_DIR, spec.ogImagePath.replace(/^\//, ''));
    const currentHash = createPostHash(frontmatter, spec);
    const previousHash = manifest[spec.manifestKey]?.hash;
    const fileExists = await exists(outPath);

    if (!fileExists || previousHash !== currentHash) {
      await fs.mkdir(path.dirname(outPath), { recursive: true });
      const svg = renderOgSvg(spec, logoDataUrl);
      await sharp(Buffer.from(svg)).png().toFile(outPath);
      generatedCount += 1;
      console.log(`OG generated: ${path.relative(ROOT, outPath)}`);
    } else {
      skippedCount += 1;
      console.log(`OG skipped: ${path.relative(ROOT, outPath)}`);
    }

    updatedManifest[spec.manifestKey] = {
      hash: currentHash,
      generatedAt: new Date().toISOString(),
    };
  }

  await fs.mkdir(path.dirname(MANIFEST_FILE), { recursive: true });
  await fs.writeFile(MANIFEST_FILE, JSON.stringify(updatedManifest, null, 2));

  console.log(`OG generation complete: ${generatedCount} generated, ${skippedCount} skipped`);
}

async function collectContentFiles(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const nestedFiles = await Promise.all(
    entries.map(async entry => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        return collectContentFiles(fullPath);
      }
      return /\.(md|mdx)$/i.test(entry.name) ? [fullPath] : [];
    })
  );

  return nestedFiles.flat();
}

function extractFrontmatter(content: string): BlogFrontmatter | undefined {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  const frontmatter = frontmatterMatch?.[1];
  if (!frontmatter) {
    return undefined;
  }
  const title = readScalar(frontmatter, 'title');
  const excerpt = readScalar(frontmatter, 'excerpt');
  const lang = readScalar(frontmatter, 'lang');
  const routeSlug = readScalar(frontmatter, 'routeSlug');

  if (!title || !excerpt || !routeSlug || (lang !== 'en' && lang !== 'th')) {
    return undefined;
  }

  return {
    title,
    excerpt,
    lang,
    routeSlug,
    tags: readStringArray(frontmatter, 'tags'),
    pubDate: readScalar(frontmatter, 'pubDate'),
  };
}

function readScalar(frontmatter: string, key: string): string | undefined {
  const pattern = new RegExp(`^${escapeRegExp(key)}:\\s*(.+)$`, 'm');
  const match = frontmatter.match(pattern);
  const value = match?.[1];
  if (!value) {
    return undefined;
  }

  return stripWrappedQuotes(value.trim());
}

function readStringArray(frontmatter: string, key: string) {
  const pattern = new RegExp(`^${escapeRegExp(key)}:\\s*\\[(.*)\\]$`, 'm');
  const match = frontmatter.match(pattern);
  const value = match?.[1];
  if (!value) {
    return [];
  }

  return value
    .split(',')
    .map(item => stripWrappedQuotes(item.trim()))
    .filter(Boolean);
}

function stripWrappedQuotes(value: string) {
  if (
    (value.startsWith("'") && value.endsWith("'")) ||
    (value.startsWith('"') && value.endsWith('"'))
  ) {
    return value.slice(1, -1).replace(/''/g, "'");
  }
  return value;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function createPostHash(frontmatter: BlogFrontmatter, spec: BlogCoverSpec) {
  return crypto
    .createHash('sha1')
    .update(
      JSON.stringify({
        version: RENDER_VERSION,
        title: frontmatter.title,
        excerpt: frontmatter.excerpt,
        lang: frontmatter.lang,
        routeSlug: frontmatter.routeSlug,
        tags: frontmatter.tags,
        pubDate: frontmatter.pubDate,
        theme: spec.theme.id,
      })
    )
    .digest('hex');
}

async function loadManifest() {
  try {
    const content = await fs.readFile(MANIFEST_FILE, 'utf8');
    return JSON.parse(content) as Record<string, { hash: string; generatedAt: string }>;
  } catch {
    return {};
  }
}

async function readLogoDataUrl() {
  try {
    const logoPath = path.join(ROOT, 'src', 'assets', 'images', 'logo.png');
    const buffer = await fs.readFile(logoPath);
    return `data:image/png;base64,${buffer.toString('base64')}`;
  } catch {
    return undefined;
  }
}

async function exists(filePath: string) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function renderOgSvg(spec: BlogCoverSpec, logoDataUrl?: string | undefined) {
  const layout = getBlogCoverTextLayout(spec, ogViewport);
  const width = ogViewport.width;
  const height = ogViewport.height;
  const fontStacks = getOgFontStacks(spec.lang);
  const panelX = width * 0.04;
  const panelY = height * 0.06;
  const panelWidth = width * 0.92;
  const panelHeight = height * 0.88;
  const contentInsetX = width * 0.036;
  const contentInsetTop = height * 0.044;
  const contentInsetBottom = height * 0.058;
  const contentX = panelX + contentInsetX;
  const contentTop = panelY + contentInsetTop;
  const contentBottom = panelY + panelHeight - contentInsetBottom;
  const contentWidth = panelWidth - contentInsetX * 2;
  const chipHeight = height * 0.071;
  const chipGap = width * 0.011;
  const chipRowBottom = contentTop + chipHeight;
  const eyebrowY = chipRowBottom + height * 0.056;
  const titleTop = eyebrowY + height * 0.112;
  const titleBlockHeight =
    layout.fontSize + Math.max(0, layout.lines.length - 1) * layout.lineHeight;
  const dividerY = Math.min(
    contentBottom - height * 0.115,
    titleTop + titleBlockHeight + height * 0.11
  );
  const metadataY = contentBottom;
  const contentRight = Math.min(contentX + layout.width, panelX + panelWidth * 0.56);
  const footerRightX = panelX + panelWidth - contentInsetX;

  const chips = [spec.primaryTag?.toUpperCase(), spec.localeLabel, spec.publishedLabel].filter(
    Boolean
  );
  let chipCursorX = contentX;
  const chipSvg = chips
    .map(chip => {
      const chipWidth = estimateChipWidth(chip ?? '', spec.lang, width);
      const svg = renderChip({
        label: chip ?? '',
        x: chipCursorX,
        y: contentTop,
        width: chipWidth,
        height: chipHeight,
        background: spec.theme.chipBackground,
        border: spec.theme.chipBorder,
        textColor: spec.theme.accentContrast,
        fontFamily: fontStacks.ui,
        lang: spec.lang,
      });
      chipCursorX += chipWidth + chipGap;
      return svg;
    })
    .join('\n');

  const titleLines = layout.lines
    .map((line, index) => {
      const y = titleTop + index * layout.lineHeight;
      return `<text x="${round(contentX)}" y="${round(y)}" fill="#F8FBFF" font-family="${fontStacks.title}" font-size="${layout.fontSize}" font-weight="${spec.lang === 'th' ? '700' : '800'}" letter-spacing="${spec.lang === 'th' ? '-0.01em' : '-0.04em'}">${escapeXml(line)}</text>`;
    })
    .join('\n');
  const localeFooterLabel = spec.lang === 'th' ? 'BLOG / TH' : 'BLOG / EN';
  const titleMeasureWidth = Math.min(contentWidth * 0.76, contentRight - contentX);
  const eyebrowSvg = `<text x="${round(contentX)}" y="${round(eyebrowY)}" fill="rgba(231,240,255,0.74)" font-family="${fontStacks.ui}" font-size="16" font-weight="650" letter-spacing="0.18em">${escapeXml(spec.eyebrowLabel)}</text>`;
  const decoration = getBlogCoverDecorationSpec({
    seed: spec.seed,
    motif: spec.theme.motif,
    density: spec.theme.density,
    viewport: ogViewport,
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${spec.theme.baseStart}" />
      <stop offset="100%" stop-color="${spec.theme.baseEnd}" />
    </linearGradient>
    <linearGradient id="panel" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${spec.theme.surfaceStart}" stop-opacity="0.92" />
      <stop offset="100%" stop-color="${spec.theme.surfaceEnd}" stop-opacity="0.84" />
    </linearGradient>
    <radialGradient id="spotA" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(${round(width * 0.18)} ${round(height * 0.14)}) rotate(38) scale(${round(width * 0.34)} ${round(height * 0.45)})">
      <stop stop-color="${spec.theme.spotPrimary}" />
      <stop offset="1" stop-color="${spec.theme.spotPrimary}" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="spotB" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(${round(width * 0.84)} ${round(height * 0.68)}) rotate(-12) scale(${round(width * 0.4)} ${round(height * 0.5)})">
      <stop stop-color="${spec.theme.spotSecondary}" />
      <stop offset="1" stop-color="${spec.theme.spotSecondary}" stop-opacity="0" />
    </radialGradient>
  </defs>

  <rect width="${width}" height="${height}" fill="url(#bg)" />
  <rect width="${width}" height="${height}" fill="url(#spotA)" />
  <rect width="${width}" height="${height}" fill="url(#spotB)" />
  <rect x="${round(panelX)}" y="${round(panelY)}" width="${round(panelWidth)}" height="${round(panelHeight)}" rx="${round(width * 0.028)}" fill="url(#panel)" stroke="rgba(255,255,255,0.11)" />
  <rect x="${round(panelX + 1.5)}" y="${round(panelY + 1.5)}" width="${round(panelWidth - 3)}" height="${round(panelHeight - 3)}" rx="${round(width * 0.026)}" fill="transparent" stroke="rgba(255,255,255,0.04)" />
  <g opacity="0.96">${decoration.layers.map(layer => renderDecorationLayer(layer, spec)).join('\n')}</g>
  ${chipSvg}
  ${logoDataUrl ? `<image href="${logoDataUrl}" x="${round(panelX + panelWidth - contentInsetX - width * 0.062)}" y="${round(contentTop + height * 0.01)}" width="${round(width * 0.062)}" height="${round(width * 0.062)}" opacity="0.92" />` : ''}
  ${eyebrowSvg}
  ${titleLines}
  <line x1="${round(contentX)}" y1="${round(dividerY)}" x2="${round(contentX + titleMeasureWidth)}" y2="${round(dividerY)}" stroke="${spec.theme.chipBorder}" stroke-width="1.5" stroke-linecap="round" />
  <text x="${round(contentX)}" y="${round(metadataY)}" fill="${spec.theme.accentSoft}" font-family="${fontStacks.ui}" font-size="22" font-weight="650" letter-spacing="0.08em">${escapeXml(SITE_TITLE)}</text>
  <text x="${round(footerRightX)}" y="${round(metadataY)}" text-anchor="end" fill="rgba(241,247,255,0.68)" font-family="${fontStacks.ui}" font-size="17" font-weight="600" letter-spacing="0.1em">${escapeXml(localeFooterLabel)}</text>
</svg>`;
}

function renderChip(params: {
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  background: string;
  border: string;
  textColor: string;
  fontFamily: string;
  lang: BlogCoverLocale;
}) {
  const fontSize = params.lang === 'th' ? 16 : 17;
  const letterSpacing = params.lang === 'th' ? '0.03em' : '0.12em';
  return `<g transform="translate(${round(params.x)} ${round(params.y)})">
    <rect width="${round(params.width)}" height="${round(params.height)}" rx="${round(params.height / 2)}" fill="${params.background}" stroke="${params.border}" />
    <text x="${round(params.width / 2)}" y="${round(params.height / 2 + 6)}" text-anchor="middle" fill="${params.textColor}" font-family="${params.fontFamily}" font-size="${fontSize}" font-weight="700" letter-spacing="${letterSpacing}">${escapeXml(params.label)}</text>
  </g>`;
}

function estimateChipWidth(label: string, lang: BlogCoverLocale, viewportWidth: number) {
  const units = estimateTextUnits(label, lang);
  const horizontalPadding = viewportWidth * (lang === 'th' ? 0.034 : 0.029);
  const minWidth = viewportWidth * (lang === 'th' ? 0.118 : 0.104);
  const maxWidth = viewportWidth * (lang === 'th' ? 0.3 : 0.27);
  const textWidth = units * viewportWidth * (lang === 'th' ? 0.0115 : 0.011);
  return Math.max(minWidth, Math.min(maxWidth, textWidth + horizontalPadding));
}

function renderDecorationLayer(layer: BlogCoverDecorationLayer, spec: BlogCoverSpec) {
  const fill = layer.fillTone ? resolveTone(spec, layer.fillTone) : 'none';
  const stroke = layer.strokeTone ? resolveTone(spec, layer.strokeTone) : 'none';
  const attributes = [
    `fill="${fill}"`,
    layer.fillOpacity !== undefined ? `fill-opacity="${round(layer.fillOpacity)}"` : undefined,
    `stroke="${stroke}"`,
    layer.strokeOpacity !== undefined
      ? `stroke-opacity="${round(layer.strokeOpacity)}"`
      : undefined,
    layer.strokeWidth !== undefined ? `stroke-width="${round(layer.strokeWidth)}"` : undefined,
    layer.kind === 'path' || layer.kind === 'line' ? 'stroke-linecap="round"' : undefined,
    layer.blur ? `style="filter:blur(${round(layer.blur)}px)"` : undefined,
    getLayerTransform(layer),
  ]
    .filter(Boolean)
    .join(' ');

  switch (layer.kind) {
    case 'circle':
      return `<circle ${attributes} cx="${round(layer.cx)}" cy="${round(layer.cy)}" r="${round(layer.r)}" />`;
    case 'ellipse':
      return `<ellipse ${attributes} cx="${round(layer.cx)}" cy="${round(layer.cy)}" rx="${round(layer.rx)}" ry="${round(layer.ry)}" />`;
    case 'line':
      return `<line ${attributes} x1="${round(layer.x1)}" y1="${round(layer.y1)}" x2="${round(layer.x2)}" y2="${round(layer.y2)}" />`;
    case 'path':
      return `<path ${attributes} d="${layer.d}" />`;
    case 'rect':
      return `<rect ${attributes} x="${round(layer.x)}" y="${round(layer.y)}" width="${round(layer.width)}" height="${round(layer.height)}" rx="${round(layer.radius)}" />`;
    default:
      return '';
  }
}

function getLayerTransform(layer: BlogCoverDecorationLayer) {
  if (!layer.rotation) {
    return undefined;
  }

  switch (layer.kind) {
    case 'circle':
      return `transform="rotate(${round(layer.rotation)} ${round(layer.cx)} ${round(layer.cy)})"`;
    case 'ellipse':
      return `transform="rotate(${round(layer.rotation)} ${round(layer.cx)} ${round(layer.cy)})"`;
    case 'rect':
      return `transform="rotate(${round(layer.rotation)} ${round(layer.x + layer.width / 2)} ${round(layer.y + layer.height / 2)})"`;
    default:
      return undefined;
  }
}

function resolveTone(spec: BlogCoverSpec, tone: BlogCoverDecorationTone) {
  switch (tone) {
    case 'accent':
      return spec.theme.accent;
    case 'accentSoft':
      return spec.theme.accentSoft;
    case 'accentStrong':
      return spec.theme.accentStrong;
    case 'accentContrast':
      return spec.theme.accentContrast;
    case 'chipBorder':
      return spec.theme.chipBorder;
    case 'gridColor':
      return spec.theme.gridColor;
    case 'spotPrimary':
      return spec.theme.spotPrimary;
    case 'spotSecondary':
      return spec.theme.spotSecondary;
    case 'white':
      return 'rgba(255,255,255,0.84)';
    default:
      return 'transparent';
  }
}

function getOgFontStacks(lang: BlogCoverLocale) {
  if (lang === 'th') {
    return {
      title: "'Anuphan', 'Thonburi', 'Arial Unicode MS', 'Helvetica Neue', Arial, sans-serif",
      ui: "'Anuphan', 'Inter', 'Helvetica Neue', Arial, sans-serif",
    };
  }

  return {
    title: "'Inter', 'Helvetica Neue', Arial, sans-serif",
    ui: "'Inter', 'Anuphan', 'Helvetica Neue', Arial, sans-serif",
  };
}

function estimateTextUnits(value: string, lang: BlogCoverLocale) {
  return Array.from(value).reduce((total, char) => total + estimateGlyphUnits(char, lang), 0);
}

function estimateGlyphUnits(char: string, lang: BlogCoverLocale) {
  if (/\s/.test(char)) {
    return 0.36;
  }

  if (/[A-Z]/.test(char)) {
    return 0.82;
  }

  if (/[a-z]/.test(char)) {
    return 0.66;
  }

  if (/[0-9]/.test(char)) {
    return 0.7;
  }

  if (/[ก-๙]/.test(char)) {
    return lang === 'th' ? 0.95 : 0.92;
  }

  return 0.74;
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function round(value: number) {
  return Math.round(value * 100) / 100;
}
