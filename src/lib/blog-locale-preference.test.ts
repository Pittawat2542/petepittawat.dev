import assert from 'node:assert/strict';
import test from 'node:test';

import {
  BLOG_LOCALE_STORAGE_KEY,
  getStoredBlogLocalePreference,
  resolveBlogLocalePreference,
  setStoredBlogLocalePreference,
} from './blog-locale-preference.ts';

test('prefers explicit query locale over saved preference', () => {
  const locale = resolveBlogLocalePreference({
    searchParams: new URLSearchParams('lang=th'),
    storedLocale: 'en',
  });

  assert.equal(locale, 'th');
});

test('falls back to the saved preference when query locale is absent or invalid', () => {
  assert.equal(
    resolveBlogLocalePreference({
      searchParams: new URLSearchParams('lang=jp'),
      storedLocale: 'th',
    }),
    'th'
  );

  assert.equal(
    resolveBlogLocalePreference({
      searchParams: new URLSearchParams(),
      storedLocale: 'th',
    }),
    'th'
  );
});

test('defaults to english when no valid preference exists', () => {
  const locale = resolveBlogLocalePreference({
    searchParams: new URLSearchParams(),
    storedLocale: 'jp',
  });

  assert.equal(locale, 'en');
});

test('reads and writes the blog locale storage key through a storage-like dependency', () => {
  const storage = new Map<string, string>();
  const storageService = {
    getItem<T>(key: string) {
      return (storage.has(key) ? (storage.get(key) as T) : null) ?? null;
    },
    setItem<T>(key: string, value: T) {
      storage.set(key, String(value));
    },
    removeItem(key: string) {
      storage.delete(key);
    },
  };

  setStoredBlogLocalePreference('th', storageService);

  assert.equal(storage.get(BLOG_LOCALE_STORAGE_KEY), 'th');
  assert.equal(getStoredBlogLocalePreference(storageService), 'th');
});
