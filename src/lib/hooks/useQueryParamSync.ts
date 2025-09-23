import { useEffect, useRef } from 'react';

export function useQueryParamSync(param: string, value: string, setValue: (next: string) => void) {
  const hydratedRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const params = new URLSearchParams(window.location.search);
      const existing = params.get(param);
      if (existing) setValue(existing);
    } catch {}
    hydratedRef.current = true;
  }, [param, setValue]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handler = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const next = params.get(param) || '';
        setValue(next);
      } catch {}
    };
    window.addEventListener('popstate', handler);
    window.addEventListener('hashchange', handler);
    return () => {
      window.removeEventListener('popstate', handler);
      window.removeEventListener('hashchange', handler);
    };
  }, [param, setValue]);

  useEffect(() => {
    if (!hydratedRef.current) return;
    if (typeof window === 'undefined') return;
    try {
      const params = new URLSearchParams(window.location.search);
      const trimmed = value.trim();
      if (trimmed) {
        params.set(param, trimmed);
      } else {
        params.delete(param);
      }
      const query = params.toString();
      const url = query ? `?${query}` : window.location.pathname;
      window.history.replaceState({}, '', url);
    } catch {}
  }, [param, value]);
}
