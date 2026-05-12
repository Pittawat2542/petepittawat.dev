import type { CSSProperties } from 'react';

import {
  getBlogCoverDecorationSpec,
  type BlogCoverDecorationLayer,
  type BlogCoverDecorationTone,
  type BlogCoverMotif,
  type BlogCoverViewport,
} from '../blog-cover/index.ts';

export const CARD_VISUAL_RENDER_VERSION = 'card-visual-v1';

export type CardVisualCollection = 'projects' | 'publications' | 'talks';

export interface CardVisualInput {
  readonly collection: CardVisualCollection;
  readonly id: string;
  readonly title: string;
  readonly tags?: readonly string[] | undefined;
  readonly type?: string | undefined;
  readonly year?: number | undefined;
  readonly date?: Date | string | number | undefined;
}

export interface CardVisualTheme {
  readonly id: string;
  readonly accent: string;
  readonly accentSoft: string;
  readonly accentStrong: string;
  readonly accentContrast: string;
  readonly baseStart: string;
  readonly baseEnd: string;
  readonly surfaceStart: string;
  readonly surfaceEnd: string;
  readonly spotPrimary: string;
  readonly spotSecondary: string;
  readonly gridColor: string;
  readonly chipBorder: string;
  readonly motif: BlogCoverMotif;
  readonly density: number;
}

export interface CardVisualSpec {
  readonly collection: CardVisualCollection;
  readonly id: string;
  readonly slug: string;
  readonly title: string;
  readonly tags: readonly string[];
  readonly primaryTag?: string | undefined;
  readonly type?: string | undefined;
  readonly year?: number | undefined;
  readonly date?: string | undefined;
  readonly theme: CardVisualTheme;
  readonly seed: number;
  readonly imagePath: string;
  readonly manifestKey: string;
  readonly renderVersion: string;
}

export type CardVisualManifest = Record<string, { hash: string; generatedAt: string }>;

type ThemeDefinition = CardVisualTheme & {
  readonly aliases: readonly string[];
};

const cardVisualViewport: BlogCoverViewport = {
  width: 1200,
  height: 630,
  variant: 'card',
};

const themes: readonly ThemeDefinition[] = [
  {
    id: 'ai',
    aliases: [
      'ai',
      'agent',
      'agents',
      'applied ai',
      'large language models',
      'llm',
      'llms',
      'reasoning',
      'typhoon',
    ],
    accent: '#b38cff',
    accentSoft: '#d7c4ff',
    accentStrong: '#7d55ee',
    accentContrast: '#f7f2ff',
    baseStart: '#0f0d20',
    baseEnd: '#171230',
    surfaceStart: '#271a4a',
    surfaceEnd: '#110f24',
    spotPrimary: 'rgba(179, 140, 255, 0.34)',
    spotSecondary: 'rgba(83, 121, 255, 0.2)',
    gridColor: 'rgba(215, 196, 255, 0.16)',
    chipBorder: 'rgba(215, 196, 255, 0.34)',
    motif: 'beam',
    density: 0.9,
  },
  {
    id: 'medical',
    aliases: ['healthcare', 'medical', 'medicine', 'clinical'],
    accent: '#6ee7b7',
    accentSoft: '#b9f8dd',
    accentStrong: '#1dbf8f',
    accentContrast: '#effff9',
    baseStart: '#061814',
    baseEnd: '#0b241f',
    surfaceStart: '#12382f',
    surfaceEnd: '#081713',
    spotPrimary: 'rgba(110, 231, 183, 0.28)',
    spotSecondary: 'rgba(29, 191, 143, 0.2)',
    gridColor: 'rgba(185, 248, 221, 0.15)',
    chipBorder: 'rgba(185, 248, 221, 0.3)',
    motif: 'halo',
    density: 0.82,
  },
  {
    id: 'evaluation',
    aliases: ['benchmark', 'evaluation', 'llm evaluation', 'metrics', 'rlhf'],
    accent: '#f7c66f',
    accentSoft: '#ffe2a6',
    accentStrong: '#d4962e',
    accentContrast: '#fff9ed',
    baseStart: '#1b1308',
    baseEnd: '#281b0c',
    surfaceStart: '#3a2914',
    surfaceEnd: '#1a1008',
    spotPrimary: 'rgba(247, 198, 111, 0.26)',
    spotSecondary: 'rgba(212, 150, 46, 0.2)',
    gridColor: 'rgba(255, 226, 166, 0.15)',
    chipBorder: 'rgba(255, 226, 166, 0.3)',
    motif: 'grid',
    density: 0.82,
  },
  {
    id: 'visualization',
    aliases: ['computer vision', 'data', 'open data', 'simulation', 'visualization'],
    accent: '#7dd3fc',
    accentSoft: '#bae6fd',
    accentStrong: '#2d9cdb',
    accentContrast: '#effaff',
    baseStart: '#071521',
    baseEnd: '#0b2233',
    surfaceStart: '#12324a',
    surfaceEnd: '#071621',
    spotPrimary: 'rgba(125, 211, 252, 0.3)',
    spotSecondary: 'rgba(45, 156, 219, 0.2)',
    gridColor: 'rgba(186, 230, 253, 0.16)',
    chipBorder: 'rgba(186, 230, 253, 0.3)',
    motif: 'wave',
    density: 0.8,
  },
  {
    id: 'web',
    aliases: ['ar', 'frontend', 'javascript', 'typescript', 'web'],
    accent: '#ff9b63',
    accentSoft: '#ffd0b3',
    accentStrong: '#ef6f36',
    accentContrast: '#fff7f1',
    baseStart: '#1b1010',
    baseEnd: '#281515',
    surfaceStart: '#3a211f',
    surfaceEnd: '#190d0d',
    spotPrimary: 'rgba(255, 155, 99, 0.3)',
    spotSecondary: 'rgba(243, 101, 43, 0.2)',
    gridColor: 'rgba(255, 211, 182, 0.14)',
    chipBorder: 'rgba(255, 204, 170, 0.28)',
    motif: 'wave',
    density: 0.76,
  },
  {
    id: 'open-source',
    aliases: ['framework', 'open source', 'tooling'],
    accent: '#9dc7ff',
    accentSoft: '#dcecff',
    accentStrong: '#648fe1',
    accentContrast: '#f4f9ff',
    baseStart: '#09111f',
    baseEnd: '#0d1729',
    surfaceStart: '#17243b',
    surfaceEnd: '#0a1222',
    spotPrimary: 'rgba(157, 199, 255, 0.26)',
    spotSecondary: 'rgba(95, 141, 221, 0.2)',
    gridColor: 'rgba(194, 217, 255, 0.15)',
    chipBorder: 'rgba(176, 209, 255, 0.28)',
    motif: 'stack',
    density: 0.74,
  },
  {
    id: 'publication',
    aliases: ['paper', 'preprint', 'publication', 'research paper', 'journal'],
    accent: '#d8b4fe',
    accentSoft: '#ead7ff',
    accentStrong: '#a855f7',
    accentContrast: '#fbf5ff',
    baseStart: '#130d1d',
    baseEnd: '#211331',
    surfaceStart: '#301d46',
    surfaceEnd: '#130d1d',
    spotPrimary: 'rgba(216, 180, 254, 0.28)',
    spotSecondary: 'rgba(168, 85, 247, 0.2)',
    gridColor: 'rgba(234, 215, 255, 0.15)',
    chipBorder: 'rgba(234, 215, 255, 0.3)',
    motif: 'orbit',
    density: 0.78,
  },
  {
    id: 'talk',
    aliases: ['conference', 'lecture', 'session', 'talk', 'tutorial', 'workshop'],
    accent: '#fda4af',
    accentSoft: '#fecdd3',
    accentStrong: '#fb7185',
    accentContrast: '#fff4f6',
    baseStart: '#1c0d12',
    baseEnd: '#2a1118',
    surfaceStart: '#3d1d27',
    surfaceEnd: '#1a0b10',
    spotPrimary: 'rgba(253, 164, 175, 0.28)',
    spotSecondary: 'rgba(251, 113, 133, 0.2)',
    gridColor: 'rgba(254, 205, 211, 0.14)',
    chipBorder: 'rgba(254, 205, 211, 0.3)',
    motif: 'halo',
    density: 0.78,
  },
  {
    id: 'project',
    aliases: ['extracurricular', 'initiative', 'project', 'side project'],
    accent: '#a7f3d0',
    accentSoft: '#d1fae5',
    accentStrong: '#34d399',
    accentContrast: '#f0fdf8',
    baseStart: '#071713',
    baseEnd: '#0d221c',
    surfaceStart: '#16362d',
    surfaceEnd: '#071713',
    spotPrimary: 'rgba(167, 243, 208, 0.24)',
    spotSecondary: 'rgba(52, 211, 153, 0.18)',
    gridColor: 'rgba(209, 250, 229, 0.14)',
    chipBorder: 'rgba(209, 250, 229, 0.28)',
    motif: 'stack',
    density: 0.72,
  },
];

export function getCardVisualPath(params: {
  readonly collection: CardVisualCollection;
  readonly slug: string;
}) {
  return `/visual/cards/${params.collection}/${normalizeSlug(params.slug)}.png`;
}

export function getCardVisualManifestKey(params: {
  readonly collection: CardVisualCollection;
  readonly slug: string;
}) {
  return `${params.collection}:${normalizeSlug(params.slug)}`;
}

export function resolveCardVisualSpec(input: CardVisualInput): CardVisualSpec {
  const tags = dedupeTags(input.tags ?? []);
  const id = normalizeSlug(input.id);
  const slug = id.length > 0 ? id : toId(input.title);
  const date = formatDateKey(input.date);
  const type = input.type?.trim();
  const primaryTag = tags[0];
  const theme = getCardVisualTheme({
    collection: input.collection,
    primaryTag,
    type,
    tags,
  });

  return {
    collection: input.collection,
    id,
    slug,
    title: input.title.trim(),
    tags,
    primaryTag,
    type: type && type.length > 0 ? type : undefined,
    year: input.year,
    date,
    theme,
    seed: hashToUint32(`${input.collection}:${slug}:${theme.id}`),
    imagePath: getCardVisualPath({ collection: input.collection, slug }),
    manifestKey: getCardVisualManifestKey({ collection: input.collection, slug }),
    renderVersion: CARD_VISUAL_RENDER_VERSION,
  };
}

export function createCardVisualHash(spec: CardVisualSpec) {
  return hashToHex40(
    JSON.stringify({
      collection: spec.collection,
      date: spec.date,
      id: spec.id,
      renderVersion: spec.renderVersion,
      seed: spec.seed,
      slug: spec.slug,
      tags: spec.tags,
      theme: spec.theme.id,
      title: spec.title,
      type: spec.type,
      year: spec.year,
    })
  );
}

export function isCardVisualStale(
  spec: CardVisualSpec,
  manifest: CardVisualManifest,
  fileExists: boolean
) {
  if (!fileExists) {
    return true;
  }

  return manifest[spec.manifestKey]?.hash !== createCardVisualHash(spec);
}

export function renderCardVisualSvg(spec: CardVisualSpec) {
  const decoration = getBlogCoverDecorationSpec({
    seed: spec.seed,
    motif: spec.theme.motif,
    density: spec.theme.density,
    viewport: cardVisualViewport,
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${cardVisualViewport.width}" height="${cardVisualViewport.height}" viewBox="0 0 ${cardVisualViewport.width} ${cardVisualViewport.height}" role="img" aria-label="">
  <defs>
    <linearGradient id="surface" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${spec.theme.surfaceStart}" />
      <stop offset="100%" stop-color="${spec.theme.surfaceEnd}" />
    </linearGradient>
    <linearGradient id="accent-sweep" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${spec.theme.accentSoft}" stop-opacity="0.5" />
      <stop offset="48%" stop-color="${spec.theme.accent}" stop-opacity="0.18" />
      <stop offset="100%" stop-color="${spec.theme.accentStrong}" stop-opacity="0.28" />
    </linearGradient>
    <filter id="soften" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="18" />
    </filter>
  </defs>
  <rect width="1200" height="630" fill="${spec.theme.baseStart}" />
  <rect width="1200" height="630" fill="url(#surface)" opacity="0.96" />
  <circle cx="150" cy="96" r="260" fill="${spec.theme.spotPrimary}" filter="url(#soften)" opacity="0.74" />
  <circle cx="1030" cy="500" r="300" fill="${spec.theme.spotSecondary}" filter="url(#soften)" opacity="0.78" />
  <path d="M-80 520 C180 430 300 260 560 310 C790 355 860 180 1280 110" fill="none" stroke="url(#accent-sweep)" stroke-width="118" stroke-linecap="round" opacity="0.44" />
  <g opacity="0.5">${renderGrid(spec.theme)}</g>
  <g opacity="0.92">${decoration.layers.map(layer => renderLayer(layer, spec.theme)).join('')}</g>
  <rect x="1" y="1" width="1198" height="628" rx="44" fill="none" stroke="${spec.theme.chipBorder}" stroke-opacity="0.34" stroke-width="2" />
</svg>`;
}

export function getCardVisualFallbackStyle(spec: Pick<CardVisualSpec, 'theme'>) {
  return {
    '--card-visual-accent': spec.theme.accent,
    '--card-visual-accent-soft': spec.theme.accentSoft,
    '--card-visual-base-start': spec.theme.baseStart,
    '--card-visual-base-end': spec.theme.baseEnd,
    '--card-visual-spot-primary': spec.theme.spotPrimary,
    '--card-visual-spot-secondary': spec.theme.spotSecondary,
  } as CSSProperties;
}

export function toProjectCardVisualInput(item: {
  readonly title: string;
  readonly tags: readonly string[];
  readonly type?: string | undefined;
  readonly year: number;
}): CardVisualInput {
  return {
    collection: 'projects',
    id: getYearTitleId(item),
    title: item.title,
    tags: item.tags,
    type: item.type,
    year: item.year,
  };
}

export function toPublicationCardVisualInput(item: {
  readonly title: string;
  readonly tags: readonly string[];
  readonly type: string;
  readonly year: number;
}): CardVisualInput {
  return {
    collection: 'publications',
    id: getYearTitleId(item),
    title: item.title,
    tags: item.tags,
    type: item.type,
    year: item.year,
  };
}

export function toTalkCardVisualInput(item: {
  readonly date: Date | string | number;
  readonly title: string;
  readonly tags: readonly string[];
  readonly mode?: string | undefined;
}): CardVisualInput {
  return {
    collection: 'talks',
    id: `${formatDateKey(item.date) ?? 'undated'}-${toId(item.title)}`,
    title: item.title,
    tags: item.tags,
    type: item.mode,
    date: item.date,
  };
}

function getCardVisualTheme(params: {
  readonly collection: CardVisualCollection;
  readonly primaryTag?: string | undefined;
  readonly tags: readonly string[];
  readonly type?: string | undefined;
}): CardVisualTheme {
  const candidates = [
    params.primaryTag,
    params.type,
    ...params.tags,
    params.collection === 'projects'
      ? 'project'
      : params.collection === 'publications'
        ? 'publication'
        : 'talk',
  ].map(normalizeToken);

  const matched =
    themes.find(theme => candidates.some(candidate => theme.aliases.includes(candidate))) ??
    themes.find(theme => theme.id === 'project');

  if (!matched) {
    throw new Error('Missing card visual fallback theme.');
  }

  return stripThemeAliases(matched);
}

function renderGrid(theme: CardVisualTheme) {
  return `<path d="M0 118 H1200 M0 236 H1200 M0 354 H1200 M0 472 H1200 M150 0 V630 M300 0 V630 M450 0 V630 M600 0 V630 M750 0 V630 M900 0 V630 M1050 0 V630" stroke="${theme.gridColor}" stroke-width="1" />
  <path d="M-40 620 L1240 -20" stroke="${theme.gridColor}" stroke-width="1" opacity="0.55" />`;
}

function renderLayer(layer: BlogCoverDecorationLayer, theme: CardVisualTheme) {
  const fill = layer.fillTone ? resolveTone(layer.fillTone, theme) : 'none';
  const stroke = layer.strokeTone ? resolveTone(layer.strokeTone, theme) : 'none';
  const fillOpacity = layer.fillOpacity ?? 1;
  const strokeOpacity = layer.strokeOpacity ?? 1;
  const strokeWidth = layer.strokeWidth ?? 1;
  const transform = getLayerTransform(layer);
  const filter = layer.blur ? ` filter="url(#soften)"` : '';
  const common = ` fill="${fill}" fill-opacity="${fillOpacity}" stroke="${stroke}" stroke-opacity="${strokeOpacity}" stroke-width="${strokeWidth}"${transform ? ` transform="${transform}"` : ''}${filter}`;

  switch (layer.kind) {
    case 'circle':
      return `<circle cx="${round(layer.cx)}" cy="${round(layer.cy)}" r="${round(layer.r)}"${common} />`;
    case 'ellipse':
      return `<ellipse cx="${round(layer.cx)}" cy="${round(layer.cy)}" rx="${round(layer.rx)}" ry="${round(layer.ry)}"${common} />`;
    case 'line':
      return `<line x1="${round(layer.x1)}" y1="${round(layer.y1)}" x2="${round(layer.x2)}" y2="${round(layer.y2)}"${common} />`;
    case 'path':
      return `<path d="${layer.d}"${common} />`;
    case 'rect':
      return `<rect x="${round(layer.x)}" y="${round(layer.y)}" width="${round(layer.width)}" height="${round(layer.height)}" rx="${round(layer.radius)}"${common} />`;
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
      return `rotate(${round(layer.rotation)} ${round(layer.cx)} ${round(layer.cy)})`;
    case 'ellipse':
      return `rotate(${round(layer.rotation)} ${round(layer.cx)} ${round(layer.cy)})`;
    case 'rect':
      return `rotate(${round(layer.rotation)} ${round(layer.x + layer.width / 2)} ${round(layer.y + layer.height / 2)})`;
    default:
      return undefined;
  }
}

function resolveTone(tone: BlogCoverDecorationTone, theme: CardVisualTheme) {
  switch (tone) {
    case 'accent':
      return theme.accent;
    case 'accentSoft':
      return theme.accentSoft;
    case 'accentStrong':
      return theme.accentStrong;
    case 'accentContrast':
      return theme.accentContrast;
    case 'chipBorder':
      return theme.chipBorder;
    case 'gridColor':
      return theme.gridColor;
    case 'spotPrimary':
      return theme.spotPrimary;
    case 'spotSecondary':
      return theme.spotSecondary;
    case 'white':
      return 'rgba(255,255,255,0.84)';
    default:
      return 'transparent';
  }
}

function getYearTitleId(item: { readonly year: number; readonly title: string }) {
  return `${item.year}-${toId(item.title)}`;
}

function normalizeSlug(value: string) {
  return toId(value);
}

function toId(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function normalizeToken(value?: string | undefined) {
  return String(value ?? '')
    .trim()
    .toLowerCase();
}

function dedupeTags(tags: readonly string[]) {
  const seen = new Set<string>();
  const uniqueTags: string[] = [];

  for (const tag of tags) {
    const trimmed = String(tag).trim();
    if (!trimmed) {
      continue;
    }

    const normalized = normalizeToken(trimmed);
    if (seen.has(normalized)) {
      continue;
    }

    seen.add(normalized);
    uniqueTags.push(trimmed);
  }

  return uniqueTags;
}

function formatDateKey(date: CardVisualInput['date']) {
  if (!date) {
    return undefined;
  }

  const parsed = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(parsed.getTime())) {
    return undefined;
  }

  return parsed.toISOString().split('T')[0];
}

function stripThemeAliases(theme: ThemeDefinition): CardVisualTheme {
  const { aliases, ...themeWithoutAliases } = theme;
  void aliases;
  return themeWithoutAliases;
}

function hashToUint32(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function hashToHex40(value: string) {
  return Array.from({ length: 5 }, (_, index) =>
    hashToUint32(`${index}:${value}:${value.length}`).toString(16).padStart(8, '0')
  ).join('');
}

function round(value: number) {
  return Number(value.toFixed(2));
}
