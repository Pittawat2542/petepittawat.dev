/**
 * useSearchFiltering - Responsible for search filtering and scoring
 * Follows Single Responsibility Principle (SRP)
 */

import { useMemo } from 'react';
import { resolveSearchItem, scoreItem } from '../utils';
import type { AugmentedSearchItem, SearchItem, SearchItemType, SearchLocale } from '../types';

export function useSearchFiltering(
  items: SearchItem[],
  query: string,
  typeFilter: Set<SearchItemType>,
  activeLocale: SearchLocale
) {
  const filtered = useMemo<AugmentedSearchItem[]>(() => {
    const allowed = new Set(typeFilter);
    const base = items.filter(item => allowed.has(item.type));
    const trimmed = query.trim();
    if (!trimmed) {
      return base.map(item => resolveSearchItem(item, activeLocale));
    }

    const matches: { item: AugmentedSearchItem; score: number; positions: number[] | undefined }[] =
      [];
    for (const item of base) {
      const result = scoreItem(item, trimmed, activeLocale);
      if (result) {
        matches.push({ item: result.item, score: result.score, positions: result.titlePositions });
      }
    }

    matches.sort((a, b) => b.score - a.score);
    return matches.map(match => ({ ...match.item, __titlePositions: match.positions }));
  }, [activeLocale, items, query, typeFilter]);

  const countsByType = useMemo(() => {
    const map = new Map<SearchItemType, number>();
    for (const item of items) {
      map.set(item.type, (map.get(item.type) ?? 0) + 1);
    }
    return map;
  }, [items]);

  const suggestions = useMemo(
    () =>
      items.filter(item => item.type === 'page').map(item => resolveSearchItem(item, activeLocale)),
    [activeLocale, items]
  );

  const tagSuggestions = useMemo(() => {
    const counts = new Map<string, number>();
    for (const item of filtered) {
      if (item.tags) {
        for (const tag of item.tags) {
          const normalized = tag.trim();
          if (normalized) {
            counts.set(normalized, (counts.get(normalized) ?? 0) + 1);
          }
        }
      }
    }

    const allTags = Array.from(counts.entries()).map(([name, count]) => ({
      name,
      count,
    }));

    if (query.startsWith('#')) {
      const cleanQuery = query.slice(1).trim().toLowerCase();
      if (!cleanQuery) {
        return allTags
          .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
          .slice(0, 15);
      }
      return allTags
        .filter(t => t.name.toLowerCase().includes(cleanQuery))
        .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
        .slice(0, 15);
    }

    return [];
  }, [filtered, query]);

  return {
    filtered,
    countsByType,
    suggestions,
    tagSuggestions,
  };
}
