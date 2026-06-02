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

function renderTyphoonSiMedThinkingSvg(_spec: CardVisualSpec) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img">
  <defs>
    <linearGradient id="med-bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#050a18" />
      <stop offset="100%" stop-color="#02050c" />
    </linearGradient>
    <linearGradient id="cube-grad-left" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0%" stop-color="rgba(147, 51, 234, 0.45)" />
      <stop offset="100%" stop-color="rgba(147, 51, 234, 0.1)" />
    </linearGradient>
    <linearGradient id="cube-grad-right" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0%" stop-color="rgba(59, 130, 246, 0.45)" />
      <stop offset="100%" stop-color="rgba(59, 130, 246, 0.1)" />
    </linearGradient>
    <linearGradient id="cube-grad-top" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="rgba(168, 85, 247, 0.3)" />
      <stop offset="100%" stop-color="rgba(6, 182, 212, 0.3)" />
    </linearGradient>
    <linearGradient id="cyan-glow-line" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#a855f7" />
      <stop offset="50%" stop-color="#3b82f6" />
      <stop offset="100%" stop-color="#06b6d4" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <filter id="strong-glow" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="15" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>
  <rect width="1200" height="630" fill="url(#med-bg)" />
  
  <!-- Glowing background spots -->
  <circle cx="300" cy="300" r="280" fill="rgba(147, 51, 234, 0.16)" filter="url(#strong-glow)" />
  <circle cx="800" cy="300" r="300" fill="rgba(59, 130, 246, 0.12)" filter="url(#strong-glow)" />
  <circle cx="300" cy="200" r="150" fill="rgba(6, 182, 212, 0.1)" filter="url(#strong-glow)" />

  <!-- Circular Radar / Target Grid in background -->
  <g opacity="0.25">
    <circle cx="300" cy="280" r="80" fill="none" stroke="#3b82f6" stroke-width="1" stroke-dasharray="4,4" />
    <circle cx="300" cy="280" r="160" fill="none" stroke="#3b82f6" stroke-width="1" />
    <circle cx="300" cy="280" r="240" fill="none" stroke="#3b82f6" stroke-width="1" stroke-dasharray="8,8" />
    <circle cx="300" cy="280" r="320" fill="none" stroke="#3b82f6" stroke-width="1" />
    <line x1="300" y1="0" x2="300" y2="560" stroke="#3b82f6" stroke-width="0.75" stroke-dasharray="5,5" />
    <line x1="20" y1="280" x2="580" y2="280" stroke="#3b82f6" stroke-width="0.75" stroke-dasharray="5,5" />
    <!-- Diagonal crosshairs -->
    <line x1="100" y1="80" x2="500" y2="480" stroke="#3b82f6" stroke-width="0.5" opacity="0.5" />
    <line x1="100" y1="480" x2="500" y2="80" stroke="#3b82f6" stroke-width="0.5" opacity="0.5" />
  </g>

  <!-- Wavy neural fibers going from the cube to the right -->
  <g filter="url(#glow)" opacity="0.8">
    <path d="M 390 280 C 500 280, 520 180, 650 140 C 720 115, 800 130, 950 180" fill="none" stroke="#a855f7" stroke-width="3" stroke-linecap="round" />
    <path d="M 390 290 C 520 290, 550 200, 700 240 C 780 260, 850 200, 980 220" fill="none" stroke="#a855f7" stroke-width="1.5" opacity="0.6" />
    
    <path d="M 390 300 C 480 300, 520 280, 600 280 C 700 280, 750 360, 900 380" fill="none" stroke="#3b82f6" stroke-width="4.5" stroke-linecap="round" />
    
    <path d="M 390 310 C 500 320, 530 380, 650 390 C 750 400, 800 320, 950 300" fill="none" stroke="#06b6d4" stroke-width="3" stroke-linecap="round" />
    <path d="M 390 320 C 520 340, 550 420, 680 430 C 760 440, 820 380, 980 410" fill="none" stroke="#06b6d4" stroke-width="1.5" opacity="0.6" />
    
    <!-- Small glowing data packets on the fibers -->
    <circle cx="560" cy="235" r="4" fill="#a855f7" />
    <circle cx="720" cy="120" r="5" fill="#f472b6" />
    <circle cx="680" cy="315" r="5" fill="#3b82f6" />
    <circle cx="820" cy="370" r="4" fill="#3b82f6" />
    <circle cx="610" cy="385" r="5" fill="#06b6d4" />
    <circle cx="780" cy="355" r="4.5" fill="#06b6d4" />
  </g>

  <!-- Isometric platform structure -->
  <g opacity="0.9">
    <!-- Pedestal Base (Bottom Plate) -->
    <polygon points="120,440 300,350 480,440 300,530" fill="rgba(15, 23, 42, 0.85)" stroke="#3b82f6" stroke-width="1.5" />
    <!-- Height of Base -->
    <polygon points="120,440 120,460 300,550 300,530" fill="rgba(8, 14, 28, 0.95)" stroke="#3b82f6" stroke-width="1.5" />
    <polygon points="480,440 480,460 300,550 300,530" fill="rgba(15, 23, 42, 0.95)" stroke="#3b82f6" stroke-width="1.5" />
    
    <!-- Pedestal Middle Layer (Smaller Plate) -->
    <polygon points="150,420 300,345 450,420 300,495" fill="rgba(30, 41, 59, 0.7)" stroke="#a855f7" stroke-width="1.5" />
    <!-- Inner glowing core -->
    <polygon points="180,405 300,345 420,405 300,465" fill="rgba(168, 85, 247, 0.15)" stroke="#a855f7" stroke-width="1" />
  </g>

  <!-- 3D Isometric Cube -->
  <g filter="url(#glow)">
    <!-- Left Face -->
    <polygon points="180,285 300,365 300,465 180,385" fill="url(#cube-grad-left)" stroke="#a855f7" stroke-width="2" />
    <!-- Right Face -->
    <polygon points="300,365 420,285 420,385 300,465" fill="url(#cube-grad-right)" stroke="#3b82f6" stroke-width="2" />
    <!-- Top Face -->
    <polygon points="300,205 420,285 300,365 180,285" fill="url(#cube-grad-top)" stroke="#06b6d4" stroke-width="2" />

    <!-- Inside Neural Network Web -->
    <g opacity="0.85">
      <circle cx="300" cy="285" r="6" fill="#ffffff" filter="url(#glow)" />
      <circle cx="250" cy="270" r="4.5" fill="#f472b6" />
      <circle cx="350" cy="270" r="4.5" fill="#60a5fa" />
      <circle cx="250" cy="320" r="4.5" fill="#c084fc" />
      <circle cx="350" cy="320" r="4.5" fill="#22d3ee" />
      <circle cx="300" cy="340" r="5" fill="#ffffff" />
      <circle cx="300" cy="235" r="5.5" fill="#22d3ee" filter="url(#glow)" />

      <line x1="300" y1="285" x2="250" y2="270" stroke="#f472b6" stroke-width="1.5" />
      <line x1="300" y1="285" x2="350" y2="270" stroke="#60a5fa" stroke-width="1.5" />
      <line x1="300" y1="285" x2="250" y2="320" stroke="#c084fc" stroke-width="1.5" />
      <line x1="300" y1="285" x2="350" y2="320" stroke="#22d3ee" stroke-width="1.5" />
      <line x1="300" y1="285" x2="300" y2="340" stroke="#e2e8f0" stroke-width="1.5" />
      <line x1="300" y1="285" x2="300" y2="235" stroke="#22d3ee" stroke-width="1.5" />

      <line x1="250" y1="270" x2="250" y2="320" stroke="#a855f7" stroke-width="1" opacity="0.6" />
      <line x1="350" y1="270" x2="350" y2="320" stroke="#3b82f6" stroke-width="1" opacity="0.6" />
      <line x1="250" y1="270" x2="300" y2="235" stroke="#a855f7" stroke-width="1" opacity="0.6" />
      <line x1="350" y1="270" x2="300" y2="235" stroke="#06b6d4" stroke-width="1" opacity="0.6" />
      <line x1="250" y1="320" x2="300" y2="340" stroke="#c084fc" stroke-width="1" opacity="0.6" />
      <line x1="350" y1="320" x2="300" y2="340" stroke="#22d3ee" stroke-width="1" opacity="0.6" />
    </g>
  </g>

  <!-- Glowing Medical Plus Sign -->
  <g filter="url(#glow)">
    <circle cx="300" cy="140" r="35" fill="rgba(168, 85, 247, 0.25)" filter="url(#strong-glow)" />
    <rect x="292" y="115" width="16" height="50" rx="6" fill="url(#cyan-glow-line)" />
    <rect x="275" y="132" width="50" height="16" rx="6" fill="url(#cyan-glow-line)" />
  </g>

  <!-- Heartbeat waveform -->
  <path d="M 50,530 L 120,530 L 132,505 L 144,555 L 156,530 L 168,530 L 176,460 L 190,590 L 204,510 L 216,545 L 228,530 L 350,530 L 362,505 L 374,555 L 386,530 L 460,530" 
        fill="none" stroke="#22d3ee" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" filter="url(#glow)" opacity="0.85" />

  <!-- HUD text -->
  <g fill="rgba(255,255,255,0.3)" font-family="monospace" font-size="11" opacity="0.6">
    <text x="50" y="60">SYS.MED_REASON_V4.0</text>
    <text x="50" y="80">MODEL_SIZE: 4B</text>
    <text x="50" y="100">CONFIDENCE: 98.42%</text>
    <text x="1050" y="60">PARAM: OK</text>
    <text x="1050" y="80">TPU_ACTIVE</text>
    <line x1="50" y1="115" x2="180" y2="115" stroke="rgba(255,255,255,0.2)" stroke-width="1" />
  </g>

  <!-- Border -->
  <rect x="1" y="1" width="1198" height="628" rx="44" fill="none" stroke="rgba(255, 255, 255, 0.08)" stroke-width="2" />
</svg>`;
}

function renderBenchIngSvg(_spec: CardVisualSpec) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img">
  <defs>
    <linearGradient id="bench-bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#060c1d" />
      <stop offset="100%" stop-color="#020409" />
    </linearGradient>
    <linearGradient id="shield-grad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="rgba(16, 185, 129, 0.35)" />
      <stop offset="100%" stop-color="rgba(6, 182, 212, 0.05)" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <filter id="strong-glow" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="16" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>
  <rect width="1200" height="630" fill="url(#bench-bg)" />

  <circle cx="300" cy="300" r="220" fill="rgba(147, 51, 234, 0.14)" filter="url(#strong-glow)" />
  <circle cx="600" cy="300" r="260" fill="rgba(16, 185, 129, 0.15)" filter="url(#strong-glow)" />
  <circle cx="900" cy="300" r="220" fill="rgba(245, 158, 11, 0.1)" filter="url(#strong-glow)" />

  <g stroke="rgba(255,255,255,0.03)" stroke-width="1">
    <path d="M0 70 H1200 M0 140 H1200 M0 210 H1200 M0 280 H1200 M0 350 H1200 M0 420 H1200 M0 490 H1200 M0 560 H1200" />
    <path d="M70 0 V630 M140 0 V630 M210 0 V630 M280 0 V630 M350 0 V630 M420 0 V630 M490 0 V630 M560 0 V630 M630 0 V630 M700 0 V630 M770 0 V630 M840 0 V630 M910 0 V630 M980 0 V630 M1050 0 V630 M1120 0 V630" />
  </g>

  <g filter="url(#glow)">
    <path d="M 80 180 Q 220 180, 240 250 T 400 310" fill="none" stroke="#a855f7" stroke-width="2.5" opacity="0.8" />
    <path d="M 80 230 Q 180 230, 230 300 T 400 315" fill="none" stroke="#8b5cf6" stroke-width="3" opacity="0.9" />
    <path d="M 80 280 Q 200 280, 220 315 T 400 320" fill="none" stroke="#6366f1" stroke-width="2" opacity="0.75" />
    <path d="M 80 330 Q 180 330, 220 310 T 400 325" fill="none" stroke="#3b82f6" stroke-width="4" opacity="0.9" />
    <path d="M 80 380 Q 200 380, 240 330 T 400 330" fill="none" stroke="#06b6d4" stroke-width="2.5" opacity="0.8" />
    <path d="M 80 430 Q 180 430, 230 350 T 400 335" fill="none" stroke="#0d9488" stroke-width="1.5" opacity="0.6" />

    <circle cx="80" cy="180" r="5" fill="#a855f7" />
    <circle cx="80" cy="230" r="6" fill="#8b5cf6" />
    <circle cx="80" cy="280" r="5" fill="#6366f1" />
    <circle cx="80" cy="330" r="7" fill="#3b82f6" />
    <circle cx="80" cy="380" r="5" fill="#06b6d4" />
    <circle cx="80" cy="430" r="4.5" fill="#0d9488" />

    <line x1="80" y1="140" x2="80" y2="470" stroke="rgba(255,255,255,0.15)" stroke-width="1" stroke-dasharray="3,3" />
  </g>

  <g filter="url(#glow)">
    <polygon points="390,260 490,240 510,360 410,380" fill="url(#shield-grad)" stroke="#10b981" stroke-width="3.5" />
    <polygon points="380,250 500,226 520,370 400,394" fill="none" stroke="rgba(16, 185, 129, 0.3)" stroke-width="1" />
    
    <path d="M 432,310 L 448,328 L 478,290" fill="none" stroke="#10b981" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />
    <circle cx="450" cy="310" r="35" fill="none" stroke="#10b981" stroke-width="1" stroke-dasharray="3,3" opacity="0.6" />
  </g>

  <g stroke="rgba(255,255,255,0.1)" stroke-width="1.5" fill="none">
    <path d="M 510,300 C 650,300 680,180 800,180" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" filter="url(#glow)" />
    <path d="M 510,310 C 620,310 650,290 800,290" stroke="#10b981" stroke-width="1.5" stroke-linecap="round" filter="url(#glow)" />
    <path d="M 510,320 C 650,320 680,410 800,410" stroke="#f59e0b" stroke-width="3" stroke-linecap="round" filter="url(#glow)" />

    <!-- Structured Output Blocks -->
    <g fill="rgba(15, 23, 42, 0.85)" stroke="#10b981" stroke-width="1.5">
      <rect x="800" y="145" width="220" height="70" rx="8" />
      <line x1="820" y1="170" x2="880" y2="170" stroke="rgba(255,255,255,0.6)" stroke-width="5" />
      <line x1="900" y1="170" x2="980" y2="170" stroke="#10b981" stroke-width="5" />
      <line x1="820" y1="190" x2="860" y2="190" stroke="rgba(255,255,255,0.6)" stroke-width="5" />
      <line x1="880" y1="190" x2="940" y2="190" stroke="#10b981" stroke-width="5" />
      <circle cx="1000" cy="180" r="5" fill="#10b981" stroke="none" filter="url(#glow)" />
    </g>

    <g fill="rgba(15, 23, 42, 0.85)" stroke="#10b981" stroke-width="1.5">
      <rect x="800" y="255" width="220" height="70" rx="8" />
      <line x1="820" y1="280" x2="890" y2="280" stroke="rgba(255,255,255,0.6)" stroke-width="5" />
      <line x1="910" y1="280" x2="970" y2="280" stroke="#10b981" stroke-width="5" />
      <line x1="820" y1="300" x2="850" y2="300" stroke="rgba(255,255,255,0.6)" stroke-width="5" />
      <line x1="870" y1="300" x2="950" y2="300" stroke="#10b981" stroke-width="5" />
      <circle cx="1000" cy="290" r="5" fill="#10b981" stroke="none" filter="url(#glow)" />
    </g>

    <g fill="rgba(15, 23, 42, 0.85)" stroke="#f59e0b" stroke-width="1.5">
      <rect x="800" y="375" width="220" height="70" rx="8" />
      <line x1="820" y1="400" x2="870" y2="400" stroke="rgba(255,255,255,0.6)" stroke-width="5" />
      <line x1="890" y1="400" x2="960" y2="400" stroke="#ef4444" stroke-width="5" />
      <circle cx="1000" cy="400" r="5" fill="#ef4444" stroke="none" filter="url(#glow)" />
      
      <path d="M 990,412 L 1000,395 L 1010,412 Z" fill="#ef4444" stroke="none" />
      <circle cx="1000" cy="409" r="1.5" fill="#ffffff" stroke="none" />
      <rect x="999" y="401" width="2" height="5" fill="#ffffff" stroke="none" />
    </g>
  </g>

  <g fill="rgba(255,255,255,0.3)" font-family="monospace" font-size="11" opacity="0.6">
    <text x="80" y="70">BENCHMARK: LLM_OUTPUT_STRUCTURE</text>
    <text x="80" y="90">METRIC: STRUCTURED_CONFORMANCE</text>
    <text x="800" y="70">EVAL: ACTIVE</text>
    <text x="800" y="90">RATE: 142.5/s</text>
    <line x1="800" y1="105" x2="900" y2="105" stroke="rgba(255,255,255,0.2)" stroke-width="1" />
  </g>

  <rect x="1" y="1" width="1198" height="628" rx="44" fill="none" stroke="rgba(255, 255, 255, 0.08)" stroke-width="2" />
</svg>`;
}

function renderOpenRlhfSvg(_spec: CardVisualSpec) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img">
  <defs>
    <linearGradient id="rlhf-bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#050816" />
      <stop offset="100%" stop-color="#010207" />
    </linearGradient>
    <linearGradient id="brain-glow" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#a855f7" />
      <stop offset="100%" stop-color="#3b82f6" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <filter id="strong-glow" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="15" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>
  <rect width="1200" height="630" fill="url(#rlhf-bg)" />

  <circle cx="600" cy="300" r="250" fill="rgba(168, 85, 247, 0.18)" filter="url(#strong-glow)" />
  <circle cx="200" cy="300" r="200" fill="rgba(59, 130, 246, 0.12)" filter="url(#strong-glow)" />
  <circle cx="1000" cy="300" r="200" fill="rgba(6, 182, 212, 0.1)" filter="url(#strong-glow)" />

  <g opacity="0.1" stroke="#3b82f6" stroke-width="1.5" fill="none">
    <circle cx="600" cy="300" r="150" />
    <circle cx="600" cy="300" r="300" stroke-dasharray="5,5" />
    <circle cx="600" cy="300" r="450" />
  </g>

  <g stroke="#3b82f6" stroke-width="1.5" fill="none" opacity="0.9">
    <g fill="rgba(15, 23, 42, 0.85)">
      <rect x="150" y="160" width="160" height="55" rx="6" stroke="#3b82f6" />
      <circle cx="175" cy="187" r="4" fill="#10b981" stroke="none" />
      <line x1="200" y1="187" x2="280" y2="187" stroke="rgba(255,255,255,0.4)" stroke-width="4" />
    </g>
    <g fill="rgba(15, 23, 42, 0.85)">
      <rect x="150" y="240" width="160" height="55" rx="6" stroke="#3b82f6" />
      <circle cx="175" cy="267" r="4" fill="#10b981" stroke="none" />
      <line x1="200" y1="267" x2="285" y2="267" stroke="rgba(255,255,255,0.4)" stroke-width="4" />
    </g>
    <g fill="rgba(15, 23, 42, 0.85)">
      <rect x="150" y="320" width="160" height="55" rx="6" stroke="#3b82f6" />
      <circle cx="175" cy="347" r="4" fill="#ef4444" stroke="none" />
      <line x1="200" y1="347" x2="270" y2="347" stroke="rgba(255,255,255,0.4)" stroke-width="4" />
    </g>
    <g fill="rgba(15, 23, 42, 0.85)">
      <rect x="150" y="400" width="160" height="55" rx="6" stroke="#3b82f6" />
      <circle cx="175" cy="427" r="4" fill="#10b981" stroke="none" />
      <line x1="200" y1="427" x2="290" y2="427" stroke="rgba(255,255,255,0.4)" stroke-width="4" />
    </g>
    <path d="M 120,480 L 340,480" stroke="rgba(59,130,246,0.3)" stroke-width="2" />
  </g>

  <g stroke="#a855f7" stroke-width="1.5" fill="none" opacity="0.9">
    <g fill="rgba(15, 23, 42, 0.85)">
      <rect x="890" y="200" width="160" height="60" rx="6" stroke="#a855f7" />
      <circle cx="915" cy="230" r="4" fill="#a855f7" stroke="none" filter="url(#glow)" />
      <line x1="935" y1="230" x2="1020" y2="230" stroke="rgba(255,255,255,0.4)" stroke-width="4" />
    </g>
    <g fill="rgba(15, 23, 42, 0.85)">
      <rect x="890" y="290" width="160" height="60" rx="6" stroke="#a855f7" />
      <circle cx="915" cy="320" r="4" fill="#a855f7" stroke="none" filter="url(#glow)" />
      <line x1="935" y1="320" x2="1005" y2="320" stroke="rgba(255,255,255,0.4)" stroke-width="4" />
    </g>
    <g fill="rgba(15, 23, 42, 0.85)">
      <rect x="890" y="380" width="160" height="60" rx="6" stroke="#a855f7" />
      <circle cx="915" cy="410" r="4" fill="#a855f7" stroke="none" filter="url(#glow)" />
      <line x1="935" y1="410" x2="1025" y2="410" stroke="rgba(255,255,255,0.4)" stroke-width="4" />
    </g>
    <path d="M 860,470 L 1080,470" stroke="rgba(168,85,247,0.3)" stroke-width="2" />
  </g>

  <g fill="none" filter="url(#glow)">
    <path d="M 310,187 C 420,187 450,260 520,270" stroke="#3b82f6" stroke-width="2.5" />
    <path d="M 310,267 C 400,267 440,290 515,285" stroke="#3b82f6" stroke-width="1.5" />
    <path d="M 310,347 C 400,347 440,310 515,315" stroke="#a855f7" stroke-width="1.5" />
    <path d="M 310,427 C 420,427 450,340 520,330" stroke="#a855f7" stroke-width="2.5" />

    <path d="M 890,230 C 780,230 750,270 680,275" stroke="#a855f7" stroke-width="2.5" />
    <path d="M 890,320 C 780,320 750,300 680,300" stroke="#3b82f6" stroke-width="1.5" opacity="0.8" />
    <path d="M 890,410 C 780,410 750,330 680,325" stroke="#3b82f6" stroke-width="2.5" />
  </g>

  <g filter="url(#glow)">
    <circle cx="600" cy="300" r="75" fill="none" stroke="url(#brain-glow)" stroke-width="2" />
    <circle cx="600" cy="300" r="78" fill="none" stroke="rgba(168, 85, 247, 0.3)" stroke-width="1" />
    <circle cx="600" cy="300" r="70" fill="none" stroke="rgba(59, 130, 246, 0.4)" stroke-width="1.5" stroke-dasharray="4,4" />
    
    <g fill="#ffffff">
      <circle cx="600" cy="225" r="4.5" />
      <circle cx="600" cy="375" r="4.5" />
      <circle cx="525" cy="300" r="4.5" />
      <circle cx="675" cy="300" r="4.5" />
      <circle cx="547" cy="247" r="3.5" fill="#a855f7" />
      <circle cx="653" cy="247" r="3.5" fill="#3b82f6" />
      <circle cx="547" cy="353" r="3.5" fill="#3b82f6" />
      <circle cx="653" cy="353" r="3.5" fill="#a855f7" />
    </g>
    
    <circle cx="600" cy="300" r="35" fill="url(#brain-glow)" opacity="0.4" filter="url(#strong-glow)" />

    <g stroke="rgba(255,255,255,0.4)" stroke-width="1" opacity="0.75">
      <line x1="600" y1="225" x2="600" y2="375" />
      <line x1="525" y1="300" x2="675" y2="300" />
      <line x1="547" y1="247" x2="653" y2="353" />
      <line x1="653" y1="247" x2="547" y2="353" />
      
      <polygon points="565,265 635,265 635,335 565,335" fill="none" stroke="#3b82f6" stroke-width="0.75" />
      <polygon points="600,250 650,300 600,350 550,300" fill="none" stroke="#a855f7" stroke-width="0.75" />
    </g>
    
    <circle cx="600" cy="300" r="6" fill="#ffffff" />
  </g>

  <g filter="url(#glow)" opacity="0.8">
    <path d="M 100,530 C 200,470 300,590 400,530 C 500,470 600,590 700,530 C 800,470 900,590 1000,530 C 1050,500 1100,500 1150,530" 
          fill="none" stroke="#3b82f6" stroke-width="3" stroke-linecap="round" />
    <path d="M 100,530 C 200,590 300,470 400,530 C 500,590 600,470 700,530 C 800,590 900,470 1000,530 C 1050,560 1100,560 1150,530" 
          fill="none" stroke="#a855f7" stroke-width="2" stroke-linecap="round" opacity="0.6" stroke-dasharray="5,5" />
  </g>

  <g fill="rgba(255,255,255,0.3)" font-family="monospace" font-size="11" opacity="0.6">
    <text x="150" y="70">SYSTEM: OPEN_RLHF_ENGINE</text>
    <text x="150" y="90">ALGORITHM: PPO / DPO SCALING</text>
    <text x="890" y="70">FEEDBACK: HUMAN_PREFERENCE</text>
    <text x="890" y="90">REWARD_MODEL: ACTIVE</text>
    <line x1="150" y1="105" x2="250" y2="105" stroke="rgba(255,255,255,0.2)" stroke-width="1" />
  </g>

  <rect x="1" y="1" width="1198" height="628" rx="44" fill="none" stroke="rgba(255, 255, 255, 0.08)" stroke-width="2" />
</svg>`;
}

function renderThaiEarthquakeSvg(_spec: CardVisualSpec) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img">
  <defs>
    <linearGradient id="eq-bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#040b1a" />
      <stop offset="100%" stop-color="#01040a" />
    </linearGradient>
    <linearGradient id="thai-map-glow" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="rgba(6, 182, 212, 0.35)" />
      <stop offset="100%" stop-color="rgba(147, 51, 234, 0.08)" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <filter id="strong-glow" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="18" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>
  <rect width="1200" height="630" fill="url(#eq-bg)" />

  <circle cx="850" cy="280" r="280" fill="rgba(6, 182, 212, 0.16)" filter="url(#strong-glow)" />
  <circle cx="300" cy="300" r="220" fill="rgba(147, 51, 234, 0.12)" filter="url(#strong-glow)" />

  <g stroke="#ef4444" stroke-width="1.5" fill="none" filter="url(#glow)">
    <circle cx="820" cy="180" r="30" opacity="0.8" />
    <circle cx="820" cy="180" r="60" stroke-dasharray="4,4" opacity="0.6" />
    <circle cx="820" cy="180" r="100" opacity="0.3" />
    <circle cx="820" cy="180" r="150" stroke-dasharray="6,6" opacity="0.15" />
    <circle cx="820" cy="180" r="6" fill="#ef4444" stroke="none" />

    <circle cx="780" cy="300" r="20" opacity="0.7" />
    <circle cx="780" cy="300" r="45" stroke-dasharray="3,3" opacity="0.5" />
    <circle cx="780" cy="300" r="80" opacity="0.2" />
    <circle cx="780" cy="300" r="4" fill="#ef4444" stroke="none" />
  </g>

  <g filter="url(#glow)">
    <line x1="80" y1="360" x2="620" y2="360" stroke="rgba(255,255,255,0.12)" stroke-width="1.5" />
    
    <path d="M 120,360 L 120,370 M 220,360 L 220,370 M 320,360 L 320,370 M 420,360 L 420,370 M 520,360 L 520,370 M 620,360 L 620,370" 
          stroke="rgba(255,255,255,0.3)" stroke-width="1" />
          
    <path d="M 80,260 L 180,260 L 200,240 L 220,290 L 235,220 L 250,310 L 260,250 L 275,275 L 290,260 L 440,260 L 455,245 L 470,285 L 485,225 L 500,300 L 515,240 L 530,270 L 545,260 L 620,260" 
          fill="none" stroke="#06b6d4" stroke-width="2.5" stroke-linejoin="round" />
          
    <path d="M 80,440 L 150,440 L 165,420 L 180,470 L 195,400 L 210,480 L 225,430 L 240,455 L 255,440 L 400,440 L 415,410 L 430,475 L 445,395 L 460,490 L 475,420 L 490,455 L 505,440 L 620,440" 
          fill="none" stroke="#a855f7" stroke-width="2" stroke-linejoin="round" opacity="0.75" />

    <circle cx="235" cy="360" r="7" fill="#ef4444" stroke="#ffffff" stroke-width="1.5" />
    <circle cx="485" cy="360" r="5" fill="#06b6d4" stroke="#ffffff" stroke-width="1" />
    
    <line x1="235" y1="360" x2="235" y2="220" stroke="rgba(239,68,68,0.5)" stroke-width="1.5" stroke-dasharray="3,3" />
    <line x1="485" y1="360" x2="485" y2="225" stroke="rgba(6,182,212,0.5)" stroke-width="1.5" stroke-dasharray="3,3" />
  </g>

  <g filter="url(#glow)">
    <polygon points="760,110 810,100 850,110 880,140 850,190 880,210 850,250 820,270 810,310 820,350 780,360 760,320 735,280 750,240 760,190 730,170" 
             fill="url(#thai-map-glow)" stroke="#06b6d4" stroke-width="3" stroke-linejoin="round" />
             
    <polygon points="770,350 780,360 780,410 750,440 755,485 780,500 790,470 780,430 810,390 795,355" 
             fill="url(#thai-map-glow)" stroke="#06b6d4" stroke-width="2.5" stroke-linejoin="round" />
  </g>

  <g stroke="rgba(6,182,212,0.25)" stroke-width="1" fill="none" opacity="0.75">
    <path d="M 680,120 L 710,120 L 710,150" />
    <path d="M 980,120 L 950,120 L 950,150" />
    <path d="M 680,480 L 710,480 L 710,450" />
    <path d="M 980,480 L 950,480 L 950,450" />
    
    <circle cx="1020" cy="180" r="25" />
    <line x1="1020" y1="150" x2="1020" y2="210" />
    <line x1="990" y1="180" x2="1050" y2="180" />
  </g>

  <g fill="rgba(255,255,255,0.3)" font-family="monospace" font-size="11" opacity="0.6">
    <text x="80" y="70">VISUALIZER: THAI_SEISMIC_TIMELINE</text>
    <text x="80" y="90">DATA_SOURCE: TMD_OPEN_DATA</text>
    <text x="1000" y="70">SYS: ACTIVE</text>
    <text x="1000" y="90">ZOOM: 100%</text>
    <line x1="80" y1="105" x2="180" y2="105" stroke="rgba(255,255,255,0.2)" stroke-width="1" />
  </g>

  <rect x="1" y="1" width="1198" height="628" rx="44" fill="none" stroke="rgba(255, 255, 255, 0.08)" stroke-width="2" />
</svg>`;
}

function renderDefaultCyberSvg(spec: CardVisualSpec) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img">
  <defs>
    <linearGradient id="bg-grad-${spec.id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${spec.theme.surfaceStart}" />
      <stop offset="100%" stop-color="${spec.theme.surfaceEnd}" />
    </linearGradient>
    <linearGradient id="line-grad-${spec.id}" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${spec.theme.accentSoft}" stop-opacity="0.6" />
      <stop offset="50%" stop-color="${spec.theme.accent}" stop-opacity="0.3" />
      <stop offset="100%" stop-color="${spec.theme.accentStrong}" stop-opacity="0.5" />
    </linearGradient>
    <filter id="glow-${spec.id}" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>
  <rect width="1200" height="630" fill="${spec.theme.baseStart}" />
  <rect width="1200" height="630" fill="url(#bg-grad-${spec.id})" opacity="0.96" />
  
  <circle cx="200" cy="200" r="250" fill="${spec.theme.spotPrimary}" filter="url(#glow-${spec.id})" opacity="0.7" />
  <circle cx="1000" cy="400" r="280" fill="${spec.theme.spotSecondary}" filter="url(#glow-${spec.id})" opacity="0.75" />

  <g opacity="0.15" stroke="${spec.theme.gridColor}" stroke-width="1">
    <path d="M0 90 H1200 M0 180 H1200 M0 270 H1200 M0 360 H1200 M0 450 H1200 M0 540 H1200" />
    <path d="M90 0 V630 M180 0 V630 M270 0 V630 M360 0 V630 M450 0 V630 M540 0 V630 M630 0 V630 M720 0 V630 M810 0 V630 M900 0 V630 M990 0 V630 M1080 0 V630" />
    <path d="M -90,0 L 1290,690" stroke-width="0.5" />
    <path d="M 1290,0 L -90,690" stroke-width="0.5" />
  </g>

  <g filter="url(#glow-${spec.id})" opacity="0.85">
    <path d="M -50,315 C 200,200 400,450 600,315 C 800,180 1000,430 1250,315" fill="none" stroke="url(#line-grad-${spec.id})" stroke-width="4.5" stroke-linecap="round" />
    <path d="M -50,225 C 250,450 350,150 600,315 C 850,480 950,180 1250,315" fill="none" stroke="${spec.theme.accent}" stroke-width="2" opacity="0.6" />
    
    <circle cx="600" cy="315" r="40" fill="none" stroke="${spec.theme.accent}" stroke-width="1.5" stroke-dasharray="3,3" />
    <circle cx="600" cy="315" r="20" fill="none" stroke="${spec.theme.accentSoft}" stroke-width="1" />
    <circle cx="600" cy="315" r="6" fill="#ffffff" />
    
    <circle cx="280" cy="270" r="5" fill="#ffffff" />
    <line x1="280" y1="270" x2="280" y2="350" stroke="${spec.theme.accent}" stroke-width="1" opacity="0.5" stroke-dasharray="2,2" />
    
    <circle cx="920" cy="360" r="5" fill="#ffffff" />
    <line x1="920" y1="360" x2="920" y2="280" stroke="${spec.theme.accent}" stroke-width="1" opacity="0.5" stroke-dasharray="2,2" />
    
    <circle cx="450" cy="400" r="4.5" fill="${spec.theme.accentSoft}" />
    <circle cx="750" cy="230" r="4.5" fill="${spec.theme.accentSoft}" />
  </g>

  <rect x="1" y="1" width="1198" height="628" rx="44" fill="none" stroke="${spec.theme.chipBorder}" stroke-opacity="0.34" stroke-width="2" />
</svg>`;
}

export function renderCardVisualSvg(spec: CardVisualSpec) {
  if (spec.collection === 'projects') {
    if (spec.slug === 'typhoon-si-med-thinking-4b') {
      return renderTyphoonSiMedThinkingSvg(spec);
    }
    if (spec.slug === 'benching-structured-output-benchmark-for-llms') {
      return renderBenchIngSvg(spec);
    }
    if (spec.slug === 'openrlhf-contributor') {
      return renderOpenRlhfSvg(spec);
    }
    if (spec.slug === 'thai-earthquake-timeline-visualizer') {
      return renderThaiEarthquakeSvg(spec);
    }
    // High-tech fallback for other projects
    return renderDefaultCyberSvg(spec);
  }

  // Original fallback rendering for publications and talks
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
