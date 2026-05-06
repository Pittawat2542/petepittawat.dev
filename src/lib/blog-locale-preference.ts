import type { IStorageService } from './services/storage.service.ts';
import { storageService } from './services/storage.service.ts';
import type { BlogTranslationLocale } from './blog-translations.ts';

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
  storage: IStorageService = storageService
): BlogTranslationLocale | undefined {
  return normalizeBlogLocale(storage.getItem<string>(BLOG_LOCALE_STORAGE_KEY));
}

export function setStoredBlogLocalePreference(
  locale: BlogTranslationLocale,
  storage: IStorageService = storageService
) {
  storage.setItem(BLOG_LOCALE_STORAGE_KEY, locale);
}
