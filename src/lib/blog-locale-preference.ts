import type { BlogTranslationLocale } from './blog-translations.ts';

export interface BlogLocaleStorage {
  getItem<T>(key: string): T | null;
  setItem<T>(key: string, value: T): void;
}

function createBrowserStorage(): BlogLocaleStorage {
  return {
    getItem<T>(key: string) {
      if (typeof window === 'undefined') {
        return null;
      }

      try {
        const raw = window.localStorage.getItem(key);
        return raw ? (JSON.parse(raw) as T) : null;
      } catch {
        return null;
      }
    },
    setItem<T>(key: string, value: T) {
      if (typeof window === 'undefined') {
        return;
      }

      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch {
        // Ignore storage write failures.
      }
    },
  };
}

const browserStorage = createBrowserStorage();

export const BLOG_LOCALE_STORAGE_KEY = 'blog:preferred-locale';

function normalizeBlogLocale(value: unknown): BlogTranslationLocale | undefined {
  if (value === 'en' || value === 'th') {
    return value;
  }
  return undefined;
}

function toSearchParams(input: URLSearchParams | string | undefined) {
  if (input instanceof URLSearchParams) {
    return input;
  }
  if (typeof input === 'string') {
    return new URLSearchParams(input);
  }
  return new URLSearchParams();
}

export function resolveBlogLocalePreference({
  searchParams,
  storedLocale,
  fallbackLocale = 'en',
}: {
  searchParams?: URLSearchParams | string | undefined;
  storedLocale?: unknown;
  fallbackLocale?: BlogTranslationLocale | undefined;
}): BlogTranslationLocale {
  const params = toSearchParams(searchParams);
  const queryLocale = normalizeBlogLocale(params.get('lang'));
  if (queryLocale) {
    return queryLocale;
  }

  const savedLocale = normalizeBlogLocale(storedLocale);
  if (savedLocale) {
    return savedLocale;
  }

  return fallbackLocale;
}

export function getStoredBlogLocalePreference(
  storage: BlogLocaleStorage = browserStorage
): BlogTranslationLocale | undefined {
  return normalizeBlogLocale(storage.getItem<string>(BLOG_LOCALE_STORAGE_KEY));
}

export function setStoredBlogLocalePreference(
  locale: BlogTranslationLocale,
  storage: BlogLocaleStorage = browserStorage
) {
  storage.setItem(BLOG_LOCALE_STORAGE_KEY, locale);
}
