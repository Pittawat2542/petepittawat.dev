import fs from 'node:fs/promises';
import path from 'node:path';

import sharp from 'sharp';

import { SITE_CONFIG } from '../src/lib/constants.ts';
import {
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
const DEFAULT_OUT_DIR = path.join(ROOT, '.cache', 'blog-cover-audit');

const ogViewport: BlogCoverViewport = { width: 1200, height: 630, variant: 'og' };
const heroViewport: BlogCoverViewport = { width: 1200, height: 630, variant: 'hero' };
const cardViewport: BlogCoverViewport = { width: 1200, height: 630, variant: 'card' };

const auditSamples = [
  {
    id: 'orbit-default-calm',
    title: 'The Common Language of Knowledge: Shared Understanding Across Research and AI',
    excerpt: 'Default/orbit coverage with a calmer composition.',
    lang: 'en' as const,
    routeSlug: 'audit-orbit-default-calm',
    tags: ['Philosophy'],
    pubDate: '2026-05-03',
  },
  {
    id: 'orbit-flutter',
    title: "Flutter: What's the Difference Between a Package and a Plugin?",
    excerpt: 'Flutter/orbit coverage with a denser technical title.',
    lang: 'en' as const,
    routeSlug: 'audit-orbit-flutter',
    tags: ['Flutter'],
    pubDate: '2020-06-14',
  },
  {
    id: 'grid-dart',
    title: 'Dart Extension Methods for Cleaner and More Intentional APIs',
    excerpt: 'Grid motif coverage.',
    lang: 'en' as const,
    routeSlug: 'audit-grid-dart',
    tags: ['Dart'],
    pubDate: '2024-07-11',
  },
  {
    id: 'beam-ai-high',
    title: 'From Assistant to Collaborator: How Natural Language Agents Shape the World',
    excerpt: 'Beam motif high-energy AI sample.',
    lang: 'en' as const,
    routeSlug: 'audit-beam-ai-high',
    tags: ['AI', 'Agents'],
    pubDate: '2023-05-28',
  },
  {
    id: 'beam-ai-th',
    title: 'ภาษากลางของความรู้ เมื่อ AI เชื่อมงานวิจัย วิศวกรรม และการนำไปใช้จริงเข้าด้วยกัน',
    excerpt: 'Thai long-title AI sample.',
    lang: 'th' as const,
    routeSlug: 'audit-beam-ai-th',
    tags: ['AI'],
    pubDate: '2026-05-03',
  },
  {
    id: 'wave-web',
    title: 'HTML Line Break Opportunities and Better Long-Form Web Typography',
    excerpt: 'Wave motif web sample.',
    lang: 'en' as const,
    routeSlug: 'audit-wave-web',
    tags: ['Web'],
    pubDate: '2022-09-12',
  },
  {
    id: 'stack-systems',
    title: 'Memory Partitioning and the Tradeoffs Behind Modern System Boundaries',
    excerpt: 'Stack motif systems sample.',
    lang: 'en' as const,
    routeSlug: 'audit-stack-systems',
    tags: ['Computer Science'],
    pubDate: '2021-10-09',
  },
  {
    id: 'halo-review',
    title: 'Review: Digimon Adventure Last Evolution and the Weight of Growing Up',
    excerpt: 'Halo motif review sample.',
    lang: 'en' as const,
    routeSlug: 'audit-halo-review',
    tags: ['Review'],
    pubDate: '2020-11-04',
  },
] satisfies readonly {
  id: string;
  title: string;
  excerpt: string;
  lang: BlogCoverLocale;
  routeSlug: string;
  tags: readonly string[];
  pubDate: string;
}[];

await main();

async function main() {
  const outDir = process.argv[2] ? path.resolve(process.argv[2]) : DEFAULT_OUT_DIR;
  const assetsDir = path.join(outDir, 'assets');
  await fs.mkdir(assetsDir, { recursive: true });

  const cards: string[] = [];

  for (const sample of auditSamples) {
    const spec = resolveBlogCoverSpec(sample);
    const ogDecoration = getBlogCoverDecorationSpec({
      seed: spec.seed,
      motif: spec.theme.motif,
      density: spec.theme.density,
      viewport: ogViewport,
    });

    const renders = await Promise.all(
      [ogViewport, heroViewport, cardViewport].map(async viewport => {
        const svg = renderAuditSvg(spec, viewport);
        const fileBase = `${sample.id}-${viewport.variant}`;
        const svgPath = path.join(assetsDir, `${fileBase}.svg`);
        const pngPath = path.join(assetsDir, `${fileBase}.png`);
        await fs.writeFile(svgPath, svg);
        await sharp(Buffer.from(svg)).png().toFile(pngPath);
        return {
          variant: viewport.variant,
          fileBase,
        };
      })
    );

    cards.push(renderSampleCard(spec, ogDecoration.patternId, renders));
  }

  await fs.writeFile(path.join(outDir, 'index.html'), renderAuditHtml(cards));
  console.log(`Blog cover audit gallery written to ${outDir}`);
}

function renderSampleCard(
  spec: BlogCoverSpec,
  patternId: string,
  renders: readonly { variant: BlogCoverViewport['variant']; fileBase: string }[]
) {
  return `<section class="sample-card">
    <header class="sample-meta">
      <div>
        <p class="sample-kicker">${escapeHtml(spec.theme.motif.toUpperCase())} / ${escapeHtml(patternId)}</p>
        <h2>${escapeHtml(spec.title)}</h2>
      </div>
      <dl>
        <div><dt>Theme</dt><dd>${escapeHtml(spec.theme.id)}</dd></div>
        <div><dt>Locale</dt><dd>${escapeHtml(spec.lang.toUpperCase())}</dd></div>
        <div><dt>Primary tag</dt><dd>${escapeHtml(spec.primaryTag ?? 'n/a')}</dd></div>
      </dl>
    </header>
    <div class="sample-grid">
      ${renders
        .map(
          render => `<figure>
          <img src="./assets/${render.fileBase}.png" alt="${escapeHtml(spec.title)} ${render.variant}" />
          <figcaption>${escapeHtml(render.variant.toUpperCase())}</figcaption>
        </figure>`
        )
        .join('\n')}
    </div>
  </section>`;
}

function renderAuditHtml(cards: readonly string[]) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Blog Cover Audit</title>
    <style>
      :root {
        color-scheme: dark;
        --bg: #07111f;
        --panel: rgba(255, 255, 255, 0.05);
        --border: rgba(255, 255, 255, 0.12);
        --text: rgba(248, 251, 255, 0.96);
        --muted: rgba(226, 235, 247, 0.66);
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        font-family: Inter, system-ui, sans-serif;
        background:
          radial-gradient(circle at top left, rgba(78, 134, 255, 0.16), transparent 32%),
          radial-gradient(circle at bottom right, rgba(173, 116, 255, 0.16), transparent 28%),
          var(--bg);
        color: var(--text);
      }
      main {
        width: min(1400px, calc(100vw - 48px));
        margin: 0 auto;
        padding: 40px 0 72px;
      }
      h1 {
        margin: 0 0 8px;
        font-size: clamp(2rem, 4vw, 3.5rem);
      }
      p.lead {
        margin: 0 0 28px;
        color: var(--muted);
        max-width: 72ch;
        line-height: 1.6;
      }
      .sample-card {
        margin: 0 0 28px;
        padding: 22px;
        border: 1px solid var(--border);
        border-radius: 24px;
        background: var(--panel);
        backdrop-filter: blur(20px);
      }
      .sample-meta {
        display: flex;
        justify-content: space-between;
        gap: 24px;
        margin: 0 0 18px;
      }
      .sample-kicker {
        margin: 0 0 6px;
        color: var(--muted);
        font-size: 0.76rem;
        letter-spacing: 0.18em;
        text-transform: uppercase;
      }
      .sample-meta h2 {
        margin: 0;
        font-size: 1.2rem;
        line-height: 1.3;
      }
      .sample-meta dl {
        display: grid;
        grid-template-columns: repeat(3, auto);
        gap: 8px 18px;
        margin: 0;
      }
      .sample-meta dt {
        color: var(--muted);
        font-size: 0.72rem;
        text-transform: uppercase;
        letter-spacing: 0.12em;
      }
      .sample-meta dd {
        margin: 2px 0 0;
        font-size: 0.92rem;
      }
      .sample-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 14px;
      }
      figure {
        margin: 0;
      }
      img {
        display: block;
        width: 100%;
        height: auto;
        border-radius: 18px;
        border: 1px solid rgba(255, 255, 255, 0.08);
      }
      figcaption {
        margin-top: 8px;
        color: var(--muted);
        font-size: 0.78rem;
        text-transform: uppercase;
        letter-spacing: 0.14em;
      }
      @media (max-width: 960px) {
        .sample-meta,
        .sample-meta dl,
        .sample-grid {
          grid-template-columns: 1fr;
          display: grid;
        }
      }
    </style>
  </head>
  <body>
    <main>
      <h1>Blog Cover Audit</h1>
      <p class="lead">Deterministic sample coverage across motifs, languages, densities, and variants. Use this gallery to audit variety, readability, safe-area discipline, and parity between OG and on-site cover elements.</p>
      ${cards.join('\n')}
    </main>
  </body>
</html>`;
}

function renderAuditSvg(spec: BlogCoverSpec, viewport: BlogCoverViewport) {
  const width = viewport.width;
  const height = viewport.height;
  const layout = getBlogCoverTextLayout(spec, viewport);
  const decoration = getBlogCoverDecorationSpec({
    seed: spec.seed,
    motif: spec.theme.motif,
    density: spec.theme.density,
    viewport,
  });
  const fontStacks = getFontStacks(spec.lang);
  const panelX = width * 0.04;
  const panelY = height * 0.06;
  const panelWidth = width * 0.92;
  const panelHeight = height * 0.88;
  const contentInsetX = width * (viewport.variant === 'card' ? 0.032 : 0.036);
  const contentInsetTop = height * 0.044;
  const contentInsetBottom = height * 0.058;
  const contentX = panelX + contentInsetX;
  const contentTop = panelY + contentInsetTop;
  const contentBottom = panelY + panelHeight - contentInsetBottom;
  const chipHeight = height * 0.071;
  const chipGap = width * 0.011;
  const chips = [
    spec.primaryTag?.toUpperCase(),
    spec.localeLabel,
    viewport.variant !== 'card' ? spec.publishedLabel : undefined,
  ].filter(Boolean);

  let chipCursorX = contentX;
  const chipSvg = chips
    .map(chip => {
      const chipWidth = estimateChipWidth(chip ?? '', spec.lang, width);
      const result = renderChip({
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
      return result;
    })
    .join('\n');

  const eyebrowY = contentTop + chipHeight + height * 0.056;
  const titleTop = eyebrowY + height * (viewport.variant === 'card' ? 0.094 : 0.112);
  const titleLines = layout.lines
    .map((line, index) => {
      const y = titleTop + index * layout.lineHeight;
      return `<text x="${round(contentX)}" y="${round(y)}" fill="#F8FBFF" font-family="${fontStacks.title}" font-size="${layout.fontSize}" font-weight="${spec.lang === 'th' ? '700' : '800'}" letter-spacing="${spec.lang === 'th' ? '-0.01em' : '-0.04em'}">${escapeXml(line)}</text>`;
    })
    .join('\n');
  const titleBlockHeight =
    layout.fontSize + Math.max(0, layout.lines.length - 1) * layout.lineHeight;
  const excerptY = titleTop + titleBlockHeight + height * 0.064;
  const dividerY = Math.min(contentBottom - height * 0.11, excerptY + height * 0.06);
  const contentRight = panelX + panelWidth - contentInsetX;
  const titleMeasureWidth = Math.min(layout.width * 0.96, width * 0.54);

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
  </defs>
  <rect width="${width}" height="${height}" fill="url(#bg)" />
  <rect width="${width}" height="${height}" fill="${spec.theme.spotPrimary}" opacity="0.18" />
  <rect x="${round(panelX)}" y="${round(panelY)}" width="${round(panelWidth)}" height="${round(panelHeight)}" rx="${round(width * 0.028)}" fill="url(#panel)" stroke="rgba(255,255,255,0.11)" />
  <rect x="${round(panelX + 1.5)}" y="${round(panelY + 1.5)}" width="${round(panelWidth - 3)}" height="${round(panelHeight - 3)}" rx="${round(width * 0.026)}" fill="transparent" stroke="rgba(255,255,255,0.04)" />
  <g opacity="0.96">${decoration.layers.map(layer => renderDecorationLayer(layer, spec)).join('\n')}</g>
  ${chipSvg}
  <text x="${round(contentX)}" y="${round(eyebrowY)}" fill="rgba(231,240,255,0.74)" font-family="${fontStacks.ui}" font-size="16" font-weight="650" letter-spacing="0.18em">${escapeXml(spec.eyebrowLabel)}</text>
  ${titleLines}
  ${
    viewport.variant !== 'card'
      ? `<text x="${round(contentX)}" y="${round(excerptY)}" fill="rgba(236,242,250,0.72)" font-family="${fontStacks.ui}" font-size="${viewport.variant === 'hero' ? 20 : 18}" font-weight="500">${escapeXml(truncateText(spec.excerpt, viewport.variant === 'hero' ? 82 : 72))}</text>`
      : ''
  }
  <line x1="${round(contentX)}" y1="${round(dividerY)}" x2="${round(contentX + titleMeasureWidth)}" y2="${round(dividerY)}" stroke="${spec.theme.chipBorder}" stroke-width="1.5" stroke-linecap="round" />
  <text x="${round(contentX)}" y="${round(contentBottom)}" fill="${spec.theme.accentSoft}" font-family="${fontStacks.ui}" font-size="${viewport.variant === 'card' ? 18 : 22}" font-weight="650" letter-spacing="0.08em">${escapeXml(SITE_CONFIG.title)}</text>
  <text x="${round(contentRight)}" y="${round(contentBottom)}" text-anchor="end" fill="rgba(241,247,255,0.68)" font-family="${fontStacks.ui}" font-size="${viewport.variant === 'card' ? 14 : 17}" font-weight="600" letter-spacing="0.1em">${viewport.variant === 'card' ? escapeXml(spec.localeLabel) : escapeXml(spec.lang === 'th' ? 'BLOG / TH' : 'BLOG / EN')}</text>
</svg>`;
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

function getFontStacks(lang: BlogCoverLocale) {
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

function estimateChipWidth(label: string, lang: BlogCoverLocale, viewportWidth: number) {
  const units = estimateTextUnits(label, lang);
  const horizontalPadding = viewportWidth * (lang === 'th' ? 0.034 : 0.029);
  const minWidth = viewportWidth * (lang === 'th' ? 0.118 : 0.104);
  const maxWidth = viewportWidth * (lang === 'th' ? 0.3 : 0.27);
  const textWidth = units * viewportWidth * (lang === 'th' ? 0.0115 : 0.011);
  return Math.max(minWidth, Math.min(maxWidth, textWidth + horizontalPadding));
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

function truncateText(value: string, maxLength: number) {
  if (value.length <= maxLength) {
    return value;
  }
  return `${value.slice(0, maxLength - 1).trimEnd()}…`;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
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
