import type { ComponentType } from 'react';
import { BookText, FolderKanban, ScrollText, Mic, Home } from 'lucide-react';

export type SearchItemType = 'blog' | 'project' | 'publication' | 'talk' | 'page';
export type SearchLocale = 'en' | 'th';
export type SearchItemLocale = SearchLocale | 'neutral';

export type SearchExtra = Record<string, string | number | boolean | null | undefined>;

export type SearchItemVariant = {
  title: string;
  description?: string | undefined;
  localizedUrl: string;
  tags?: string[] | undefined;
  date?: string | number | undefined;
  extra?: SearchExtra | undefined;
};

export type SearchItem = {
  id: string;
  type: SearchItemType;
  locale: SearchItemLocale;
  translationId?: string | undefined;
  availableLocales: SearchLocale[];
  title: string;
  description?: string | undefined;
  localizedUrl: string;
  alternateUrl?: string | undefined;
  tags?: string[] | undefined;
  date?: string | number | undefined;
  extra?: SearchExtra | undefined;
  locales?: Partial<Record<SearchLocale, SearchItemVariant>> | undefined;
};

export type AugmentedSearchItem = SearchItem & {
  __titlePositions?: number[] | undefined;
  isFallback?: boolean | undefined;
  matchedLocale?: SearchItemLocale | undefined;
};

export type SearchTypeMeta = {
  key: SearchItemType;
  label: string;
  Icon: ComponentType<{ size?: number }>;
};

export const SEARCH_TYPE_META: SearchTypeMeta[] = [
  { key: 'blog', label: 'Blog', Icon: BookText },
  { key: 'project', label: 'Projects', Icon: FolderKanban },
  { key: 'publication', label: 'Publications', Icon: ScrollText },
  { key: 'talk', label: 'Talks', Icon: Mic },
  { key: 'page', label: 'Pages', Icon: Home },
];

export const SEARCH_TYPE_META_MAP = Object.fromEntries(
  SEARCH_TYPE_META.map(meta => [meta.key, meta])
) as Record<SearchItemType, SearchTypeMeta>;

export function typeAccentClasses(type: SearchItemType) {
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
