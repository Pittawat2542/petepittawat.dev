import { useEffect, useMemo, useRef, useState } from 'react';
import type React from 'react';
import { Dialog, DialogContent, DialogTrigger, DialogClose, DialogTitle, DialogDescription } from './ui/dialog';
import SearchInput from './ui/SearchInput';
import { Badge } from './ui/badge';
import { cn } from '../lib/utils';
import { Command, Search as SearchIcon, ExternalLink, BookText, FolderKanban, ScrollText, Mic, Home, CornerDownLeft, Clock } from 'lucide-react';

type Item = {
  id: string;
  type: 'blog' | 'project' | 'publication' | 'talk' | 'page';
  title: string;
  description?: string;
  url: string;
  tags?: string[];
  date?: string | number;
  extra?: Record<string, string | number | boolean | null | undefined>;
};

type AugmentedItem = Item & { __titlePositions?: number[] };

function typeColor(type: Item['type']) {
  switch (type) {
    case 'blog':
      return 'bg-[color:var(--accent-blog)]/15 text-[color:var(--accent-blog)]';
    case 'project':
      return 'bg-[color:var(--accent-projects)]/15 text-[color:var(--accent-projects)]';
    case 'publication':
      return 'bg-[color:var(--accent-publications)]/15 text-[color:var(--accent-publications)]';
    case 'talk':
      return 'bg-[color:var(--accent-talks)]/15 text-[color:var(--accent-talks)]';
    default:
      return 'bg-muted text-muted-foreground';
  }
}

const typeIcon: Record<Item['type'], React.ComponentType<{ size?: number }>> = {
  blog: BookText,
  project: FolderKanban,
  publication: ScrollText,
  talk: Mic,
  page: Home,
};

type MatchResult = {
  item: Item;
  score: number;
  // Matched character positions for the title (for highlighting)
  titlePositions?: number[];
};

function normalize(s: unknown) {
  return String(s ?? '').toLowerCase();
}

// Simple fuzzy subsequence matcher with scoring and position capture
function fuzzyMatch(query: string, target: string): { score: number; positions: number[] } | null {
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
  const density = q.length / span; // closer to 1 when contiguous
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
  const earlyBonus = 1 / (1 + start); // prefer earlier matches
  const runBonus = 1 + maxRun / 10;
  const score = q.length * (1 + density * 2) * runBonus * earlyBonus;
  return { score, positions };
}

function scoreItem(item: Item, query: string): MatchResult | null {
  const fields: { text: string; weight: number; key: 'title' | 'desc' | 'tags' | 'extra' }[] = [
    { text: item.title, weight: 3.0, key: 'title' },
    { text: item.description || '', weight: 1.4, key: 'desc' },
    { text: (item.tags || []).join(' '), weight: 1.2, key: 'tags' },
    { text: Object.values(item.extra || {}).join(' '), weight: 1.0, key: 'extra' },
  ];

  let bestScore = 0;
  let titlePositions: number[] | undefined;
  for (const f of fields) {
    const m = fuzzyMatch(query, f.text);
    if (m) {
      const s = m.score * f.weight;
      if (s > bestScore) {
        bestScore = s;
        if (f.key === 'title') titlePositions = m.positions;
        else titlePositions = undefined;
      }
    }
  }
  if (bestScore <= 0) return null;
  return { item, score: bestScore, titlePositions };
}

function highlightTitle(title: string, positions?: number[]) {
  if (!positions || positions.length === 0) return title;
  // Merge contiguous positions into ranges
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

  const out: React.ReactNode[] = [];
  let last = 0;
  for (const [s, e] of ranges) {
    if (last < s) out.push(title.slice(last, s));
    out.push(
      <mark key={`${s}-${e}`} className="rounded bg-white/10 px-0.5">
        {title.slice(s, e + 1)}
      </mark>
    );
    last = e + 1;
  }
  if (last < title.length) out.push(title.slice(last));
  return out;
}

export default function SearchModal({ autoOpen = false, hideTriggers = false, openKey }: { autoOpen?: boolean; hideTriggers?: boolean; openKey?: number } = {}) {
  const [open, setOpen] = useState(!!autoOpen);
  const [q, setQ] = useState('');
  const [items, setItems] = useState<Item[]>([]);
  const [loaded, setLoaded] = useState(false);
  const listRef = useRef<HTMLUListElement | null>(null);
  const [active, setActive] = useState(0);
  const [typeFilter, setTypeFilter] = useState<Set<Item['type']>>(new Set(['blog','project','publication','talk','page']));
  const [recent, setRecent] = useState<string[]>([]);

  // If requested, open immediately on mount
  useEffect(() => {
    if (autoOpen) setOpen(true);
    // only run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Programmatic open when key changes
  useEffect(() => {
    if (openKey !== undefined) setOpen(true);
  }, [openKey]);

  // Load index on first open
  useEffect(() => {
    if (!open || loaded) return;
    fetch('/search.json')
      .then((r) => r.json())
      .then((data) => {
        setItems(data.items as Item[]);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, [open, loaded]);

  // Keyboard shortcut: Cmd/Ctrl + K
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
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

  // Load recent searches when modal opens (client-only)
  useEffect(() => {
    if (!open) return;
    try {
      const raw = localStorage.getItem('recent-searches');
      if (raw) setRecent(JSON.parse(raw));
    } catch {}
  }, [open]);

  const saveRecent = (query: string) => {
    const t = query.trim();
    if (!t) return;
    const next = [t, ...recent.filter((x) => x.toLowerCase() !== t.toLowerCase())].slice(0, 6);
    setRecent(next);
    try {
      localStorage.setItem('recent-searches', JSON.stringify(next));
    } catch {}
  };

  // Compute filtered results early so effects can depend on it safely
  const filtered = useMemo<AugmentedItem[]>(() => {
    const allowed = new Set(typeFilter);
    const base = items.filter((it) => allowed.has(it.type));
    const ql = q.trim();
    if (!ql) return base;
    const matches: MatchResult[] = [];
    for (const it of base) {
      const res = scoreItem(it, ql);
      if (res) matches.push(res);
    }
    matches.sort((a, b) => b.score - a.score);
    return matches.map((m) => ({ ...m.item, __titlePositions: m.titlePositions }));
  }, [items, q, typeFilter]);

  // Helper to build href adding ?q before any #fragment
  const buildHref = (it: AugmentedItem, qInput: string) => {
    const raw = String(it.url || '');
    const hasHash = raw.includes('#');
    const [base, hash] = hasHash ? [raw.slice(0, raw.indexOf('#')), raw.slice(raw.indexOf('#'))] : [raw, ''];
    const url = new URL(base, window.location.origin);
    // Prefill with item title for anchored list pages (projects/publications/talks)
    const preferTitle = hasHash && (it.type === 'project' || it.type === 'publication' || it.type === 'talk');
    const qVal = (preferTitle ? it.title : qInput).trim();
    // Only add ?q= for destinations that support it
    const path = url.pathname.replace(/\/$/, '');
    const supportsQ = preferTitle || path === '/blog' || path === '/projects' || path === '/publications' || path === '/talks' || path.startsWith('/tags');
    if (supportsQ && qVal) url.searchParams.set('q', qVal);
    return `${url.pathname}${url.search}${hash}`;
  };

  // In-modal keyboard navigation and selection
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      const key = e.key;
      const results = filtered;
      if (!results.length) return;
      if (key === 'ArrowDown' || key === 'ArrowUp' || key === 'PageDown' || key === 'PageUp' || key === 'Home' || key === 'End') {
        e.preventDefault();
      }
      if (key === 'ArrowDown') setActive((i) => Math.min(i + 1, results.length - 1));
      if (key === 'ArrowUp') setActive((i) => Math.max(i - 1, 0));
      if (key === 'PageDown') setActive((i) => Math.min(i + 5, results.length - 1));
      if (key === 'PageUp') setActive((i) => Math.max(i - 5, 0));
      if (key === 'Home') setActive(0);
      if (key === 'End') setActive(results.length - 1);
      if (key === 'Enter') {
        const it = results[active];
        if (it) {
          const href = buildHref(it, q);
          saveRecent((Object.prototype.hasOwnProperty.call(it, 'title') && it.type !== 'page') ? it.title : q);
          if (e.metaKey || e.ctrlKey) window.open(href, '_blank');
          else window.location.assign(href);
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, filtered, active]);

  useEffect(() => {
    setActive(0);
  }, [q, typeFilter, open]);

  useEffect(() => {
    const el = listRef.current?.children[active] as HTMLElement | undefined;
    el?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  // filtered is defined above

  const countsByType = useMemo(() => {
    const map = new Map<Item['type'], number>();
    for (const it of items) map.set(it.type, (map.get(it.type) || 0) + 1);
    return map;
  }, [items]);

  const types: { key: Item['type']; label: string; Icon: React.ComponentType<{ size?: number }> }[] = [
    { key: 'blog', label: 'Blog', Icon: BookText },
    { key: 'project', label: 'Projects', Icon: FolderKanban },
    { key: 'publication', label: 'Publications', Icon: ScrollText },
    { key: 'talk', label: 'Talks', Icon: Mic },
    { key: 'page', label: 'Pages', Icon: Home },
  ];

  const suggestions = useMemo(() => items.filter((i) => i.type === 'page'), [items]);

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setQ(''); }}>
      {!hideTriggers && (
        <DialogTrigger asChild>
          <button
            className={cn(
              'hidden md:inline-flex items-center gap-2 rounded-full px-3 py-2',
              'text-sm hover:bg-[color:var(--white)]/5 transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--white)]/30'
            )}
            aria-label="Open search"
            title="Search (⌘/Ctrl + K)"
          >
            <SearchIcon size={16} className="opacity-80" />
            <span className="opacity-90">Search</span>
            <span className="ml-2 hidden lg:inline-flex items-center gap-1 rounded-md border border-white/10 px-1.5 py-0.5 text-xs text-white/70">
              <Command size={12} />K
            </span>
          </button>
        </DialogTrigger>
      )}
      {/* Mobile icon trigger */}
      {!hideTriggers && (
        <DialogTrigger asChild>
          <button
            className={cn(
              'md:hidden inline-flex items-center justify-center rounded-full p-2',
              'hover:bg-[color:var(--white)]/10 focus-visible:outline-none',
              'focus-visible:ring-2 focus-visible:ring-[color:var(--white)]/30'
            )}
            aria-label="Open search"
            title="Search"
          >
            <SearchIcon size={18} className="opacity-90" />
          </button>
        </DialogTrigger>
      )}
      <DialogContent
        className="no-paint-contain max-w-none w-[min(72rem,92vw)] p-0 overflow-visible top-[12vh] -translate-y-0 sm:top-1/2 sm:-translate-y-1/2"
        style={{ overflowY: 'visible' }}
      >
        <DialogTitle className="sr-only">Site Search</DialogTitle>
        <DialogDescription className="sr-only">Type to search posts, projects, publications, talks, and pages. Use arrow keys to navigate results.</DialogDescription>
        {/* Close button moved to top-right to avoid clustering with input clear */}
        <DialogClose
          className="absolute -top-4 -right-4 z-10 inline-flex items-center justify-center rounded-full p-2.5 border border-white/15 bg-black/40 backdrop-blur-md text-muted-foreground hover:text-foreground hover:bg-white/10 shadow-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
          aria-label="Close search"
          title="Close (Esc)"
        >
          <span className="sr-only">Close</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </DialogClose>
        <div className="p-4 md:p-5 lg:p-6 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <SearchInput
                value={q}
                onChange={setQ}
                placeholder="Search posts, projects, publications, talks..."
                ariaLabel="Universal search"
                size="lg"
              />
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground" aria-live="polite">
            <div className="flex items-center gap-1.5">
              <span className="hidden sm:inline">Navigate with</span>
              <kbd className="rounded border px-1 py-0.5">↑</kbd>
              <kbd className="rounded border px-1 py-0.5">↓</kbd>
              <span className="inline-flex items-center gap-1"><CornerDownLeft size={12} /> Enter</span>
              <span className="hidden sm:inline">• Esc to close</span>
            </div>
            <div>{filtered.length} results</div>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <button
              className={cn(
                'text-xs rounded-full px-3 py-1 border',
                typeFilter.size === 5 ? 'bg-white/10 border-white/20' : 'border-white/10 hover:bg-white/5'
              )}
              onClick={() => setTypeFilter(new Set(['blog','project','publication','talk','page']))}
            >All</button>
            {types.map(({ key, label, Icon }) => (
              <button
                key={key}
                className={cn(
                  'text-xs rounded-full px-3 py-1 border inline-flex items-center gap-1',
                  typeFilter.has(key) ? 'bg-white/10 border-white/20' : 'border-white/10 hover:bg-white/5'
                )}
                onClick={() => {
                  const next = new Set(typeFilter);
                  if (next.has(key)) next.delete(key); else next.add(key);
                  if (next.size === 0) next.add(key);
                  setTypeFilter(next);
                }}
                aria-pressed={typeFilter.has(key)}
              >
                <Icon size={12} /> {label}
                <span className="opacity-70">{countsByType.get(key) || 0}</span>
              </button>
            ))}
          </div>
          {open && loaded && q.trim() === '' && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {recent.length > 0 && (
                <>
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground"><Clock size={12} /> Recent:</span>
                  {recent.map((r) => (
                    <button
                      key={r}
                      className="text-xs rounded-full px-3 py-1 border border-white/10 hover:bg-white/5"
                      onClick={() => setQ(r)}
                      aria-label={`Use recent search ${r}`}
                    >
                      {r}
                    </button>
                  ))}
                  <button
                    className="ml-1 text-[11px] text-muted-foreground hover:text-foreground underline decoration-dotted"
                    onClick={() => { setRecent([]); localStorage.removeItem('recent-searches'); }}
                    aria-label="Clear recent searches"
                  >Clear</button>
                </>
              )}
            </div>
          )}
        </div>
        <div className="relative max-h-[60dvh] md:max-h-[60vh] overflow-y-auto p-3 md:p-4">
          {/* top/bottom scroll shadows */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-3 bg-gradient-to-b from-card/80 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-3 bg-gradient-to-t from-card/80 to-transparent" />
          {!loaded && (
            <ul className="divide-y divide-border animate-pulse">
              {Array.from({ length: 6 }).map((_, i) => (
                <li key={i} className="px-4 py-3">
                  <div className="h-4 w-24 bg-white/10 rounded mb-2" />
                  <div className="h-4 w-3/4 bg-white/10 rounded" />
                </li>
              ))}
            </ul>
          )}
          {loaded && q.trim() === '' && (
            <div className="px-3 py-8 text-sm text-muted-foreground">
              <p className="mb-3">Start typing to search across the site, or explore:</p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <a key={s.id} href={s.url} className="rounded-full px-3 py-1 border border-white/10 hover:bg-white/5">{s.title}</a>
                ))}
              </div>
            </div>
          )}
          {loaded && q.trim() !== '' && filtered.length === 0 && (
            <div className="px-3 py-4 text-sm text-muted-foreground">
              <p className="mb-2">No results. Try a different query or explore:</p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <a key={s.id} href={s.url} className="rounded-full px-3 py-1 border border-white/10 hover:bg-white/5">{s.title}</a>
                ))}
              </div>
            </div>
          )}
          {loaded && q.trim() !== '' && filtered.length > 0 && (
            <ul ref={listRef} className="divide-y divide-border" role="listbox" aria-activedescendant={`sr-${active}`}>
              {filtered.slice(0, 50).map((it, idx: number) => (
                <li id={`sr-${idx}`} key={it.id} role="option" aria-selected={idx === active} className={cn(idx === active && 'bg-white/10')}>
                  <a
                    href={buildHref(it, q)}
                    className={cn(
                      'flex items-start gap-3 px-4 py-3 hover:bg-white/5 transition-colors',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40'
                    )}
                    onClick={() => { saveRecent((it.type !== 'page') ? it.title : q); setOpen(false); }}
                  >
                    <div className="pt-0.5 flex items-center gap-2 min-w-[7rem]">
                      <div className={cn('rounded-md p-1.5 border border-white/10', typeColor(it.type))}>
                        {(() => {
                          const Icon = typeIcon[it.type as Item['type']];
                          return <Icon size={14} />;
                        })()}
                      </div>
                      <Badge className={cn('capitalize', typeColor(it.type))}>{it.type}</Badge>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-medium truncate">{highlightTitle(it.title, it.__titlePositions)}</h3>
                        {it.date && (
                          <span className="text-xs text-muted-foreground">{String(it.date).slice(0, 10)}</span>
                        )}
                      </div>
                      {it.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2">{it.description}</p>
                      )}
                      {it.tags && it.tags.length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {it.tags.slice(0, 5).map((t: string) => (
                            <span key={t} className="text-[10px] text-muted-foreground/80">#{t}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
                      {idx === active && (
                        <>
                          <span className="hidden sm:inline-flex items-center gap-1"><CornerDownLeft size={12} /> Open</span>
                          <span className="hidden lg:inline-flex items-center gap-1"><Command size={12} /> + Enter new tab</span>
                        </>
                      )}
                      <ExternalLink size={14} className="opacity-60" />
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
