import React from 'react';
import type { AugmentedSearchItem, SearchItem, SearchItemType } from './types';

function normalize(value: unknown) {
  return String(value ?? '').toLowerCase();
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
    const idx = t.indexOf(ch, ti);
    if (idx === -1) return null;
    positions.push(idx);
    ti = idx + 1;
  }

  const start = positions[0];
  const end = positions[positions.length - 1];
  const span = Math.max(1, end - start + 1);
  const density = q.length / span;
  let maxRun = 1;
  let run = 1;
  for (let i = 1; i < positions.length; i++) {
    if (positions[i] === positions[i - 1] + 1) {
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
  item: SearchItem;
  score: number;
  titlePositions?: number[];
};

export function scoreItem(item: SearchItem, query: string): MatchResult | null {
  const fields: { text: string; weight: number; key: 'title' | 'desc' | 'tags' | 'extra' }[] = [
    { text: item.title, weight: 3, key: 'title' },
    { text: item.description || '', weight: 1.4, key: 'desc' },
    { text: (item.tags || []).join(' '), weight: 1.2, key: 'tags' },
    { text: Object.values(item.extra || {}).join(' '), weight: 1, key: 'extra' },
  ];

  let bestScore = 0;
  let titlePositions: number[] | undefined;
  for (const field of fields) {
    const result = fuzzyMatch(query, field.text);
    if (!result) continue;
    const weighted = result.score * field.weight;
    if (weighted > bestScore) {
      bestScore = weighted;
      titlePositions = field.key === 'title' ? result.positions : undefined;
    }
  }

  if (bestScore <= 0) return null;
  return { item, score: bestScore, titlePositions };
}

export function highlightTitle(title: string, positions?: number[]) {
  if (!positions || positions.length === 0) return title;
  const ranges: [number, number][] = [];
  let start = positions[0];
  let prev = positions[0];
  for (let i = 1; i < positions.length; i++) {
    const cur = positions[i];
    if (cur === prev + 1) {
      prev = cur;
    } else {
      ranges.push([start, prev]);
      start = prev = cur;
    }
  }
  ranges.push([start, prev]);

  const nodes: React.ReactNode[] = [];
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
  if (typeof window === 'undefined') return item.url;
  const raw = String(item.url || '');
  const hashIndex = raw.indexOf('#');
  const hasHash = hashIndex >= 0;
  const base = hasHash ? raw.slice(0, hashIndex) : raw;
  const hash = hasHash ? raw.slice(hashIndex) : '';
  const url = new URL(base, window.location.origin);
  const preferTitle = hasHash && (item.type === 'project' || item.type === 'publication' || item.type === 'talk');
  const qValue = (preferTitle ? item.title : query).trim();
  const path = url.pathname.replace(/\/$/, '');
  const supportsQ =
    preferTitle ||
    path === '/blog' ||
    path === '/projects' ||
    path === '/publications' ||
    path === '/talks' ||
    path.startsWith('/tags');

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
