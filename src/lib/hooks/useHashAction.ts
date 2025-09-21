import { useEffect } from 'react';

export function useHashAction(prefix: string, action: (hash: string) => void, delay = 100) {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash;
    if (!hash || !hash.startsWith(`#${prefix}`)) return;
    const timer = window.setTimeout(() => action(hash), delay);
    return () => window.clearTimeout(timer);
  }, [action, delay, prefix]);
}