import { ui, defaultLang } from './ui';

export type AppLocale = keyof typeof ui;

export function getLangFromUrl(url: URL) {
  return getLangFromPathname(url.pathname);
}

export function getLangFromPathname(pathname: string) {
  const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const [, lang] = normalizedPath.split('/');
  if (lang && lang in ui) return lang as AppLocale;
  return defaultLang;
}

export function localizePath(path: string, lang: AppLocale) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  if (lang === defaultLang) {
    return normalizedPath;
  }
  return normalizedPath === '/' ? `/${lang}` : `/${lang}${normalizedPath}`;
}

export function useTranslations(lang: AppLocale) {
  return function t(key: keyof (typeof ui)[typeof defaultLang]) {
    return ui[lang][key] || ui[defaultLang][key];
  };
}

export function useTranslatedPath(lang: AppLocale) {
  return function translatePath(path: string, l: string = lang) {
    return !path.startsWith('/') && l !== defaultLang
      ? `/${l}/${path}`
      : l === defaultLang
        ? path
        : `/${l}${path.startsWith('/') ? path : `/${path}`}`;
  };
}
