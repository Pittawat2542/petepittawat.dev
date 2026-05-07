export type BlogCoverLocale = 'en' | 'th';
export type BlogCoverVariant = 'og' | 'hero' | 'card';
export type BlogCoverMotif = 'orbit' | 'grid' | 'beam' | 'stack' | 'wave' | 'halo';

export * from './decorations.ts';

export interface BlogCoverViewport {
  width: number;
  height: number;
  variant: BlogCoverVariant;
}

export interface BlogCoverTheme {
  id: string;
  accent: string;
  accentSoft: string;
  accentStrong: string;
  accentContrast: string;
  baseStart: string;
  baseEnd: string;
  surfaceStart: string;
  surfaceEnd: string;
  spotPrimary: string;
  spotSecondary: string;
  gridColor: string;
  chipBackground: string;
  chipBorder: string;
  motif: BlogCoverMotif;
  density: number;
}

export interface BlogCoverSpecInput {
  title: string;
  excerpt: string;
  lang: BlogCoverLocale;
  routeSlug: string;
  tags?: readonly string[] | undefined;
  pubDate?: Date | string | number | undefined;
}

export interface BlogCoverSpec {
  title: string;
  excerpt: string;
  lang: BlogCoverLocale;
  routeSlug: string;
  tags: readonly string[];
  primaryTag?: string | undefined;
  theme: BlogCoverTheme;
  seed: number;
  ogImagePath: string;
  manifestKey: string;
  localeLabel: string;
  eyebrowLabel: string;
  publishedLabel?: string | undefined;
}

export interface BlogCoverTextLayout {
  lines: string[];
  fontSize: number;
  lineHeight: number;
  maxLines: number;
  width: number;
}

type ThemeDefinition = BlogCoverTheme & {
  aliases: readonly string[];
};

const SITE_TITLE = 'PETEPITTAWAT.DEV';

const coverThemes: readonly ThemeDefinition[] = [
  {
    id: 'flutter',
    aliases: ['flutter'],
    accent: '#6ac1ff',
    accentSoft: '#a5ddff',
    accentStrong: '#2f7be6',
    accentContrast: '#eff7ff',
    baseStart: '#06111f',
    baseEnd: '#0a1930',
    surfaceStart: '#0d203b',
    surfaceEnd: '#0a1528',
    spotPrimary: 'rgba(106, 193, 255, 0.34)',
    spotSecondary: 'rgba(40, 125, 250, 0.26)',
    gridColor: 'rgba(156, 214, 255, 0.18)',
    chipBackground: 'rgba(19, 52, 95, 0.46)',
    chipBorder: 'rgba(146, 211, 255, 0.34)',
    motif: 'orbit',
    density: 0.82,
  },
  {
    id: 'dart',
    aliases: ['dart'],
    accent: '#4fd1c5',
    accentSoft: '#8ff0e7',
    accentStrong: '#1fa59a',
    accentContrast: '#ebfffc',
    baseStart: '#06181a',
    baseEnd: '#0b2328',
    surfaceStart: '#0f2d30',
    surfaceEnd: '#0a191c',
    spotPrimary: 'rgba(79, 209, 197, 0.32)',
    spotSecondary: 'rgba(28, 136, 144, 0.22)',
    gridColor: 'rgba(149, 255, 241, 0.16)',
    chipBackground: 'rgba(16, 61, 64, 0.46)',
    chipBorder: 'rgba(132, 244, 230, 0.32)',
    motif: 'grid',
    density: 0.76,
  },
  {
    id: 'ai',
    aliases: [
      'ai',
      'agents',
      'workflow',
      'tutorial',
      'mcp',
      'reasoning',
      'typhoon',
      'data science',
      'medical',
    ],
    accent: '#b38cff',
    accentSoft: '#d2bcff',
    accentStrong: '#7d55ee',
    accentContrast: '#f5efff',
    baseStart: '#0f0d20',
    baseEnd: '#171230',
    surfaceStart: '#261a4a',
    surfaceEnd: '#120f24',
    spotPrimary: 'rgba(179, 140, 255, 0.32)',
    spotSecondary: 'rgba(120, 87, 233, 0.22)',
    gridColor: 'rgba(212, 193, 255, 0.16)',
    chipBackground: 'rgba(58, 37, 105, 0.5)',
    chipBorder: 'rgba(210, 188, 255, 0.34)',
    motif: 'beam',
    density: 0.88,
  },
  {
    id: 'web',
    aliases: ['web', 'html', 'javascript'],
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
    chipBackground: 'rgba(88, 42, 30, 0.48)',
    chipBorder: 'rgba(255, 204, 170, 0.28)',
    motif: 'wave',
    density: 0.74,
  },
  {
    id: 'systems',
    aliases: ['computer science', 'operating systems', 'product'],
    accent: '#8ab4ff',
    accentSoft: '#c6dbff',
    accentStrong: '#537ee8',
    accentContrast: '#eef4ff',
    baseStart: '#0c1426',
    baseEnd: '#101b33',
    surfaceStart: '#172746',
    surfaceEnd: '#0c162b',
    spotPrimary: 'rgba(138, 180, 255, 0.28)',
    spotSecondary: 'rgba(84, 117, 210, 0.2)',
    gridColor: 'rgba(191, 214, 255, 0.15)',
    chipBackground: 'rgba(28, 48, 88, 0.44)',
    chipBorder: 'rgba(180, 205, 255, 0.28)',
    motif: 'stack',
    density: 0.7,
  },
  {
    id: 'review',
    aliases: ['review', 'books', 'movie'],
    accent: '#f5a76a',
    accentSoft: '#ffd8b2',
    accentStrong: '#d17b3d',
    accentContrast: '#fff7ef',
    baseStart: '#1a120f',
    baseEnd: '#271812',
    surfaceStart: '#3b261e',
    surfaceEnd: '#190f0b',
    spotPrimary: 'rgba(245, 167, 106, 0.28)',
    spotSecondary: 'rgba(215, 116, 58, 0.2)',
    gridColor: 'rgba(255, 220, 192, 0.14)',
    chipBackground: 'rgba(95, 53, 33, 0.44)',
    chipBorder: 'rgba(255, 216, 178, 0.28)',
    motif: 'halo',
    density: 0.78,
  },
  {
    id: 'default',
    aliases: ['general', 'philosophy'],
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
    chipBackground: 'rgba(25, 44, 79, 0.42)',
    chipBorder: 'rgba(176, 209, 255, 0.28)',
    motif: 'orbit',
    density: 0.66,
  },
];

type LayoutConfig = {
  maxLines: number;
  baseFontSize: number;
  minFontSize: number;
  widthRatio: number;
  unitScale: number;
};

const layoutByVariant: Record<BlogCoverVariant, LayoutConfig> = {
  og: {
    maxLines: 4,
    baseFontSize: 64,
    minFontSize: 36,
    widthRatio: 0.58,
    unitScale: 0.6,
  },
  hero: {
    maxLines: 4,
    baseFontSize: 52,
    minFontSize: 24,
    widthRatio: 0.82,
    unitScale: 0.63,
  },
  card: {
    maxLines: 3,
    baseFontSize: 32,
    minFontSize: 18,
    widthRatio: 0.84,
    unitScale: 0.68,
  },
};

export function getBlogOgImagePath(params: { lang: BlogCoverLocale; routeSlug: string }) {
  return `/og/blog/${params.lang}/${params.routeSlug}.png`;
}

export function getBlogOgManifestKey(params: { lang: BlogCoverLocale; routeSlug: string }) {
  return `${params.lang}:${params.routeSlug}`;
}

export function getBlogCoverTheme(primaryTag?: string | undefined): BlogCoverTheme {
  const normalizedTag = normalizeTag(primaryTag);
  const matchedTheme =
    coverThemes.find(theme => theme.aliases.includes(normalizedTag)) ??
    coverThemes.find(theme => theme.id === 'default');

  if (!matchedTheme) {
    throw new Error('Missing default blog cover theme.');
  }

  return stripThemeAliases(matchedTheme);
}

export function resolveBlogCoverSpec(input: BlogCoverSpecInput): BlogCoverSpec {
  const tags = dedupeTags(input.tags ?? []);
  const primaryTag = tags[0];
  const theme = getBlogCoverTheme(primaryTag);
  const routeSlug = normalizeRouteSlug(input.routeSlug);
  const ogImagePath = getBlogOgImagePath({ lang: input.lang, routeSlug });

  return {
    title: input.title.trim(),
    excerpt: input.excerpt.trim(),
    lang: input.lang,
    routeSlug,
    tags,
    primaryTag,
    theme,
    seed: hashToUint32(`${input.lang}:${routeSlug}:${theme.id}`),
    ogImagePath,
    manifestKey: getBlogOgManifestKey({ lang: input.lang, routeSlug }),
    localeLabel: input.lang === 'th' ? 'ฉบับภาษาไทย' : 'ENGLISH EDITION',
    eyebrowLabel: input.lang === 'th' ? 'บันทึกภาคสนาม' : 'FIELD NOTES',
    publishedLabel: formatPublishedLabel(input.pubDate, input.lang),
  };
}

export function getBlogCoverTextLayout(
  spec: Pick<BlogCoverSpec, 'title' | 'lang'>,
  viewport: BlogCoverViewport
): BlogCoverTextLayout {
  const config = layoutByVariant[viewport.variant];
  const width = Math.max(240, Math.round(viewport.width * config.widthRatio));
  const minFontSize = Math.min(config.minFontSize, config.baseFontSize);
  const titleUnits = estimateTextUnits(spec.title, spec.lang);
  const adaptiveStartFontSize = Math.max(
    minFontSize,
    config.baseFontSize -
      Math.min(20, Math.max(0, Math.floor((titleUnits - (spec.lang === 'th' ? 28 : 34)) / 4) * 2))
  );

  for (let fontSize = adaptiveStartFontSize; fontSize >= minFontSize; fontSize -= 4) {
    const maxUnits = width / (fontSize * config.unitScale);
    const lines = wrapTextByLocale(spec.title, spec.lang, maxUnits, config.maxLines);

    if (lines.length <= config.maxLines) {
      const lineHeightMultiplier = getLineHeightMultiplier(viewport.variant, spec.lang);
      return {
        lines,
        fontSize,
        lineHeight: Math.round(fontSize * lineHeightMultiplier),
        maxLines: config.maxLines,
        width,
      };
    }
  }

  const fallbackLines = wrapTextByLocale(
    spec.title,
    spec.lang,
    width / (minFontSize * config.unitScale),
    config.maxLines
  );
  const truncatedLines = truncateLines(fallbackLines, config.maxLines);

  return {
    lines: truncatedLines,
    fontSize: minFontSize,
    lineHeight: Math.round(minFontSize * getLineHeightMultiplier(viewport.variant, spec.lang)),
    maxLines: config.maxLines,
    width,
  };
}

export function getBlogCoverCssVariables(theme: BlogCoverTheme) {
  return {
    '--blog-cover-accent': theme.accent,
    '--blog-cover-accent-soft': theme.accentSoft,
    '--blog-cover-accent-strong': theme.accentStrong,
    '--blog-cover-accent-contrast': theme.accentContrast,
    '--blog-cover-base-start': theme.baseStart,
    '--blog-cover-base-end': theme.baseEnd,
    '--blog-cover-surface-start': theme.surfaceStart,
    '--blog-cover-surface-end': theme.surfaceEnd,
    '--blog-cover-spot-primary': theme.spotPrimary,
    '--blog-cover-spot-secondary': theme.spotSecondary,
    '--blog-cover-grid': theme.gridColor,
    '--blog-cover-chip-bg': theme.chipBackground,
    '--blog-cover-chip-border': theme.chipBorder,
    '--blog-cover-density': theme.density.toString(),
    '--accent-blog': theme.accent,
    '--backdrop-base-start': theme.baseStart,
    '--backdrop-base-end': theme.baseEnd,
    '--backdrop-spot-a': theme.spotPrimary,
    '--backdrop-spot-b': theme.spotSecondary,
    '--page-accent': theme.accent,
    '--card-accent': theme.accent,
  };
}

export function serializeCssVariables(variables: Record<string, string>) {
  return Object.entries(variables)
    .map(([key, value]) => `${key}:${value}`)
    .join(';');
}

function normalizeTag(tag?: string | undefined) {
  return String(tag ?? '')
    .trim()
    .toLowerCase();
}

function normalizeRouteSlug(routeSlug: string) {
  return routeSlug.trim().replace(/^\/+|\/+$/g, '');
}

function dedupeTags(tags: readonly string[]) {
  const seen = new Set<string>();
  const uniqueTags: string[] = [];

  for (const tag of tags) {
    const trimmed = String(tag).trim();
    if (!trimmed) {
      continue;
    }

    const normalized = normalizeTag(trimmed);
    if (seen.has(normalized)) {
      continue;
    }

    seen.add(normalized);
    uniqueTags.push(trimmed);
  }

  return uniqueTags;
}

function stripThemeAliases(theme: ThemeDefinition): BlogCoverTheme {
  const { aliases, ...themeWithoutAliases } = theme;
  void aliases;
  return themeWithoutAliases;
}

function formatPublishedLabel(pubDate: BlogCoverSpecInput['pubDate'], lang: BlogCoverLocale) {
  if (!pubDate) {
    return undefined;
  }

  const date = pubDate instanceof Date ? pubDate : new Date(pubDate);
  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  return new Intl.DateTimeFormat(lang === 'th' ? 'th-TH' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

function getLineHeightMultiplier(variant: BlogCoverVariant, lang: BlogCoverLocale) {
  if (variant === 'og') {
    return lang === 'th' ? 1.15 : 1.08;
  }

  return lang === 'th' ? 1.24 : 1.14;
}

function wrapTextByLocale(
  title: string,
  lang: BlogCoverLocale,
  maxUnitsPerLine: number,
  maxLines: number
) {
  const words = segmentTitle(title, lang);
  const joiner = lang === 'th' ? '' : ' ';
  const lines: string[] = [];
  let currentLine: string[] = [];
  let currentUnits = 0;

  for (const word of words) {
    if (/^\s+$/.test(word)) {
      if (currentLine.length > 0) {
        currentLine.push(' ');
        currentUnits += 0.35;
      }
      continue;
    }

    const wordUnits = estimateTextUnits(word, lang);
    const joinerUnits = currentLine.length > 0 && lang !== 'th' ? 0.55 : 0;

    if (currentLine.length > 0 && currentUnits + joinerUnits + wordUnits > maxUnitsPerLine) {
      lines.push(currentLine.join(joiner).trim());
      currentLine = [word];
      currentUnits = wordUnits;
    } else if (wordUnits > maxUnitsPerLine) {
      const splitChunks = splitLongToken(word, lang, maxUnitsPerLine);
      for (const chunk of splitChunks) {
        const chunkUnits = estimateTextUnits(chunk, lang);
        if (currentLine.length > 0) {
          lines.push(currentLine.join(joiner).trim());
          currentLine = [];
          currentUnits = 0;
        }
        if (chunkUnits <= maxUnitsPerLine) {
          currentLine = [chunk];
          currentUnits = chunkUnits;
        }
      }
    } else {
      currentLine.push(word);
      currentUnits += joinerUnits + wordUnits;
    }

    if (lines.length >= maxLines) {
      break;
    }
  }

  if (lines.length < maxLines && currentLine.length > 0) {
    lines.push(currentLine.join(joiner).trim());
  }

  return truncateLines(lines, maxLines);
}

function truncateLines(lines: string[], maxLines: number) {
  if (lines.length <= maxLines) {
    return lines;
  }

  const truncated = lines.slice(0, maxLines);
  truncated[maxLines - 1] = appendEllipsis(truncated[maxLines - 1] ?? '');
  return truncated;
}

function appendEllipsis(line: string) {
  return line.endsWith('…') ? line : `${line.replace(/[.,;:!?-]+$/g, '').trimEnd()}…`;
}

function splitLongToken(token: string, lang: BlogCoverLocale, maxUnitsPerLine: number) {
  const graphemes = segmentGraphemes(token);
  const chunks: string[] = [];
  let current = '';

  for (const grapheme of graphemes) {
    const next = `${current}${grapheme}`;
    if (current && estimateTextUnits(next, lang) > maxUnitsPerLine) {
      chunks.push(current);
      current = grapheme;
    } else {
      current = next;
    }
  }

  if (current) {
    chunks.push(current);
  }

  return chunks;
}

function segmentTitle(title: string, lang: BlogCoverLocale) {
  const trimmedTitle = title.trim();
  if (!trimmedTitle) {
    return [''];
  }

  if (lang === 'th' && typeof Intl.Segmenter === 'function') {
    const segmenter = new Intl.Segmenter('th', { granularity: 'word' });
    const segments = trimmedTitle
      .split(/(\s+)/)
      .filter(segment => segment.length > 0)
      .flatMap(segment => {
        if (/^\s+$/.test(segment)) {
          return [' '];
        }
        if (/[ก-๙]/.test(segment)) {
          return Array.from(segmenter.segment(segment), item => item.segment).filter(Boolean);
        }
        return [segment];
      });

    if (segments.length > 0) {
      return segments;
    }
  }

  return trimmedTitle.split(/\s+/).filter(Boolean);
}

function segmentGraphemes(value: string) {
  if (typeof Intl.Segmenter === 'function') {
    return Array.from(
      new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(value),
      segment => segment.segment
    );
  }

  return Array.from(value);
}

function estimateTextUnits(value: string, lang: BlogCoverLocale) {
  let total = 0;
  for (const char of value) {
    total += estimateCharUnit(char, lang);
  }
  return total;
}

function estimateCharUnit(char: string, lang: BlogCoverLocale) {
  if (char === ' ') {
    return 0.35;
  }

  if (lang === 'th') {
    return 1.06;
  }

  if ('ilI1'.includes(char)) {
    return 0.45;
  }
  if ('mwMW@#%&'.includes(char)) {
    return 1.08;
  }
  if (/[A-Z]/.test(char)) {
    return 0.84;
  }
  if (/[0-9]/.test(char)) {
    return 0.72;
  }
  return 0.7;
}

function hashToUint32(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export { SITE_TITLE };
