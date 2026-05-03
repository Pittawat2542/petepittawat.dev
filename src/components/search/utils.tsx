import type {
  AugmentedSearchItem,
  SearchItem,
  SearchItemLocale,
  SearchItemType,
  SearchLocale,
} from './types';
import type { ReactNode } from 'react';
import { getLangFromPathname } from '@/i18n/utils';

function normalize(value: unknown) {
  return String(value ?? '').toLowerCase();
}

function getOtherLocale(locale: SearchLocale): SearchLocale {
  return locale === 'th' ? 'en' : 'th';
}

type FuzzyMatchResult = { score: number; positions: number[] };

export function fuzzyMatch(query: string, target: string): FuzzyMatchResult | null {
  const q = normalize(query);
  const t = normalize(target);
  if (!q || !t) return null;

  let ti = 0;
  const positions: number[] = [];
  for (let qi = 0; qi < q.length; qi++) {
    const ch = q[qi];
    if (ch === undefined) continue;
    const idx = t.indexOf(ch, ti);
    if (idx === -1) return null;
    positions.push(idx);
    ti = idx + 1;
  }

  const start = positions[0];
  const end = positions[positions.length - 1];
  if (start === undefined || end === undefined) return null;
  const span = Math.max(1, end - start + 1);
  const density = q.length / span;
  let maxRun = 1;
  let run = 1;
  for (let i = 1; i < positions.length; i++) {
    const current = positions[i];
    const previous = positions[i - 1];
    if (current !== undefined && previous !== undefined && current === previous + 1) {
      run++;
      if (run > maxRun) maxRun = run;
    } else {
      run = 1;
    }
  }
  const earlyBonus = 1 / (1 + start);
  const runBonus = 1 + maxRun / 10;
  const score = q.length * (1 + density * 2) * runBonus * earlyBonus;
  return { score, positions };
}

export type MatchResult = {
  item: AugmentedSearchItem;
  score: number;
  titlePositions: number[] | undefined;
};

type SearchableContent = {
  title: string;
  description?: string | undefined;
  tags?: string[] | undefined;
  extra?: SearchItem['extra'];
};

function scoreSearchContent(content: SearchableContent, query: string) {
  const fields: { text: string; weight: number; key: 'title' | 'desc' | 'tags' | 'extra' }[] = [
    { text: content.title, weight: 3, key: 'title' },
    { text: content.description || '', weight: 1.4, key: 'desc' },
    { text: (content.tags || []).join(' '), weight: 1.2, key: 'tags' },
    { text: Object.values(content.extra || {}).join(' '), weight: 1, key: 'extra' },
  ];

  let bestScore = 0;
  let titlePositions: number[] | undefined = undefined;
  for (const field of fields) {
    const result = fuzzyMatch(query, field.text);
    if (!result) continue;
    const weighted = result.score * field.weight;
    if (weighted > bestScore) {
      bestScore = weighted;
      titlePositions = field.key === 'title' ? result.positions : undefined;
    }
  }

  return bestScore > 0 ? { score: bestScore, titlePositions } : null;
}

function localePriority(locale: SearchItemLocale, activeLocale: SearchLocale, fallback: boolean) {
  if (locale === 'neutral') return 1_000;
  if (!fallback && locale === activeLocale) return 2_000;
  return 0;
}

export function resolveSearchItem(
  item: SearchItem,
  activeLocale: SearchLocale,
  viewerLocale: SearchLocale = activeLocale
): AugmentedSearchItem {
  const fallbackLocale = getOtherLocale(activeLocale);
  const activeVariant = item.locales?.[activeLocale];
  const fallbackVariant = item.locales?.[fallbackLocale];
  const selectedVariant = activeVariant || fallbackVariant;

  if (!selectedVariant) {
    return {
      ...item,
      matchedLocale: item.locale,
      isFallback: item.locale !== 'neutral' && item.locale !== activeLocale,
    };
  }

  const resolvedLocale =
    item.locale === 'neutral' ? 'neutral' : activeVariant ? activeLocale : fallbackLocale;
  const alternateVariant =
    item.locale !== 'neutral' && activeVariant && fallbackVariant
      ? resolvedLocale === activeLocale
        ? fallbackVariant
        : activeVariant
      : undefined;

  return {
    ...item,
    title: selectedVariant.title,
    description: selectedVariant.description,
    localizedUrl: selectedVariant.localizedUrl,
    alternateUrl: alternateVariant?.localizedUrl,
    tags: selectedVariant.tags,
    date: selectedVariant.date ?? item.date,
    extra: selectedVariant.extra ?? item.extra,
    locale: resolvedLocale,
    matchedLocale: resolvedLocale,
    isFallback: item.locale !== 'neutral' && resolvedLocale !== viewerLocale,
  };
}

export function scoreItem(
  item: SearchItem,
  query: string,
  activeLocale: SearchLocale
): MatchResult | null {
  const candidates: Array<{
    variant: AugmentedSearchItem;
    score: number;
    titlePositions?: number[] | undefined;
  }> = [];

  const activeVariant = item.locales?.[activeLocale];
  const fallbackLocale = getOtherLocale(activeLocale);
  const otherVariant = item.locales?.[fallbackLocale];

  if (item.locale === 'neutral') {
    const resolved = resolveSearchItem(item, activeLocale);
    const scored = scoreSearchContent(resolved, query);
    if (scored) {
      candidates.push({
        variant: resolved,
        score: scored.score + localePriority('neutral', activeLocale, false),
        titlePositions: scored.titlePositions,
      });
    }
  } else {
    if (activeVariant) {
      const resolved = resolveSearchItem(item, activeLocale);
      const scored = scoreSearchContent(
        {
          title: activeVariant.title,
          description: activeVariant.description,
          tags: activeVariant.tags,
          extra: activeVariant.extra,
        },
        query
      );
      if (scored) {
        candidates.push({
          variant: resolved,
          score: scored.score + localePriority(activeLocale, activeLocale, false),
          titlePositions: scored.titlePositions,
        });
      }
    }

    if (otherVariant) {
      const resolved = resolveSearchItem(item, fallbackLocale, activeLocale);
      const scored = scoreSearchContent(
        {
          title: otherVariant.title,
          description: otherVariant.description,
          tags: otherVariant.tags,
          extra: otherVariant.extra,
        },
        query
      );
      if (scored) {
        candidates.push({
          variant: resolved,
          score: scored.score + localePriority(fallbackLocale, activeLocale, true),
          titlePositions: scored.titlePositions,
        });
      }
    }
  }

  if (!candidates.length) return null;

  candidates.sort((a, b) => b.score - a.score);
  const best = candidates[0];
  if (!best) return null;

  return {
    item: { ...best.variant, __titlePositions: best.titlePositions },
    score: best.score,
    titlePositions: best.titlePositions,
  };
}

export function highlightTitle(title: string, positions?: number[]) {
  if (!positions || positions.length === 0) return title;
  const ranges: [number, number][] = [];
  let start = positions[0];
  let prev = positions[0];

  if (start === undefined || prev === undefined) return title;

  for (let i = 1; i < positions.length; i++) {
    const cur = positions[i];
    if (cur === undefined) continue;
    if (prev !== undefined && cur === prev + 1) {
      prev = cur;
    } else {
      ranges.push([start, prev]);
      start = prev = cur;
    }
  }
  if (start !== undefined && prev !== undefined) {
    ranges.push([start, prev]);
  }

  const nodes: ReactNode[] = [];
  let last = 0;
  for (const [s, e] of ranges) {
    if (last < s) nodes.push(title.slice(last, s));
    nodes.push(
      <mark key={`${s}-${e}`} className="rounded bg-white/10 px-0.5">
        {title.slice(s, e + 1)}
      </mark>
    );
    last = e + 1;
  }
  if (last < title.length) nodes.push(title.slice(last));
  return nodes;
}

export function buildHref(item: AugmentedSearchItem, query: string) {
  if (typeof window === 'undefined') return item.localizedUrl;
  const raw = String(item.localizedUrl || '');
  const hashIndex = raw.indexOf('#');
  const hasHash = hashIndex >= 0;
  const base = hasHash ? raw.slice(0, hashIndex) : raw;
  const hash = hasHash ? raw.slice(hashIndex) : '';
  const url = new URL(base, window.location.origin);
  const preferTitle =
    hasHash && (item.type === 'project' || item.type === 'publication' || item.type === 'talk');
  const qValue = (preferTitle ? item.title : query).trim();
  const path = url.pathname.replace(/\/$/, '');
  const supportsQ =
    preferTitle ||
    /^\/(?:th\/)?projects$/.test(path) ||
    /^\/(?:th\/)?publications$/.test(path) ||
    /^\/(?:th\/)?talks$/.test(path) ||
    path.startsWith('/tags') ||
    path.startsWith('/th/tags');

  if (supportsQ && qValue) {
    url.searchParams.set('q', qValue);
  } else if (supportsQ) {
    url.searchParams.delete('q');
  }

  return `${url.pathname}${url.search}${hash}`;
}

export function ensureAllTypes(): Set<SearchItemType> {
  return new Set<SearchItemType>(['blog', 'project', 'publication', 'talk', 'page']);
}

export function getActiveSearchLocale() {
  if (typeof window === 'undefined') return 'en' as const;
  return getLangFromPathname(window.location.pathname);
}
