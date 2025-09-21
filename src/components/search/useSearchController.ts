import type { AugmentedSearchItem, SearchItem, SearchItemType } from './types';
import { buildHref, ensureAllTypes, scoreItem } from './utils';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type UseSearchControllerParams = {
  autoOpen?: boolean;
  openKey?: number;
};

export function useSearchController({ autoOpen = false, openKey }: UseSearchControllerParams) {
  const [open, setOpen] = useState(autoOpen);
  const [query, setQuery] = useState('');
  const [items, setItems] = useState<SearchItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [typeFilter, setTypeFilter] = useState<Set<SearchItemType>>(ensureAllTypes);
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef<HTMLUListElement | null>(null);
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    if (autoOpen) setOpen(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (openKey !== undefined) setOpen(true);
  }, [openKey]);

  useEffect(() => {
    if (!open || loaded) return;
    fetch('/search.json')
      .then((response) => response.json())
      .then((data) => {
        setItems((data.items || []) as SearchItem[]);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, [open, loaded]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen(true);
        setTimeout(() => {
          const el = document.querySelector('input[aria-label="Universal search"]') as HTMLInputElement | null;
          el?.focus();
        }, 0);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (!open) return;
    try {
      const raw = localStorage.getItem('recent-searches');
      if (raw) setRecent(JSON.parse(raw));
    } catch {}
  }, [open]);

  const saveRecent = useCallback((value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    setRecent((prev) => {
      const next = [trimmed, ...prev.filter((entry) => entry.toLowerCase() !== trimmed.toLowerCase())].slice(0, 6);
      try {
        localStorage.setItem('recent-searches', JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const clearRecent = useCallback(() => {
    setRecent([]);
    try {
      localStorage.removeItem('recent-searches');
    } catch {}
  }, []);

  const filtered = useMemo<AugmentedSearchItem[]>(() => {
    const allowed = new Set(typeFilter);
    const base = items.filter((item) => allowed.has(item.type));
    const trimmed = query.trim();
    if (!trimmed) return base;

    const matches: { item: SearchItem; score: number; positions: number[] | undefined }[] = [];
    for (const item of base) {
      const result = scoreItem(item, trimmed);
      if (result) {
        matches.push({ item: result.item, score: result.score, positions: result.titlePositions });
      }
    }

    matches.sort((a, b) => b.score - a.score);
    return matches.map((match) => ({ ...match.item, __titlePositions: match.positions }));
  }, [items, query, typeFilter]);

  const countsByType = useMemo(() => {
    const map = new Map<SearchItemType, number>();
    for (const item of items) {
      map.set(item.type, (map.get(item.type) || 0) + 1);
    }
    return map;
  }, [items]);

  const suggestions = useMemo(() => items.filter((item) => item.type === 'page'), [items]);

  const toggleType = useCallback((type: SearchItemType) => {
    setTypeFilter((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      if (next.size === 0) next.add(type);
      return next;
    });
  }, []);

  const selectAllTypes = useCallback(() => setTypeFilter(ensureAllTypes()), []);

  useEffect(() => {
    if (!open) return;
    const handler = (event: KeyboardEvent) => {
      const results = filtered;
      if (!results.length) return;
      const key = event.key;
      if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End'].includes(key)) {
        event.preventDefault();
      }
      if (key === 'ArrowDown') setActiveIndex((index) => Math.min(index + 1, results.length - 1));
      if (key === 'ArrowUp') setActiveIndex((index) => Math.max(index - 1, 0));
      if (key === 'PageDown') setActiveIndex((index) => Math.min(index + 5, results.length - 1));
      if (key === 'PageUp') setActiveIndex((index) => Math.max(index - 5, 0));
      if (key === 'Home') setActiveIndex(0);
      if (key === 'End') setActiveIndex(results.length - 1);
      if (key === 'Enter') {
        const item = results[activeIndex];
        if (!item) return;
        const href = buildHref(item, query);
        saveRecent(item.type !== 'page' ? item.title : query);
        if (event.metaKey || event.ctrlKey) {
          window.open(href, '_blank');
        } else {
          window.location.assign(href);
        }
        setOpen(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [filtered, activeIndex, query, saveRecent, open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query, typeFilter, open]);

  useEffect(() => {
    const element = listRef.current?.children[activeIndex] as HTMLElement | undefined;
    element?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  const handleOpenChange = useCallback((next: boolean) => {
    setOpen(next);
    if (!next) setQuery('');
  }, []);

  const getHref = useCallback((item: AugmentedSearchItem) => buildHref(item, query), [query]);

  const handleResultClick = useCallback(
    (item: AugmentedSearchItem) => {
      saveRecent(item.type !== 'page' ? item.title : query);
      setOpen(false);
    },
    [query, saveRecent]
  );

  return {
    state: {
      open,
      query,
      loaded,
      filtered,
      suggestions,
      recent,
      countsByType,
      typeFilter,
      activeIndex,
    },
    actions: {
      setQuery,
      setActiveIndex,
      toggleType,
      selectAllTypes,
      clearRecent,
      setQueryFromRecent: setQuery,
      handleOpenChange,
      getHref,
      handleResultClick,
    },
    refs: {
      listRef,
    },
  };
}
