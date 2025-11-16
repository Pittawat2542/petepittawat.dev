/**
 * useUrlParams - Responsible for reading URL parameters on mount
 * Follows Single Responsibility Principle (SRP) and Dependency Inversion Principle (DIP)
 *
 * IMPORTANT: Mount-Only Behavior
 * This hook reads URL parameters ONLY once on component mount.
 * The onParams callback and parser function are captured at mount time using refs.
 * This prevents the effect from re-running when these functions change after mount.
 *
 * Callers should ensure:
 * 1. onParams and parser are stable (memoized with useCallback/useMemo) for predictable behavior
 * 2. Or understand that only the initial versions of these functions will be used
 */

import { useEffect, useRef } from 'react';
import { navigationService } from '@/lib/services';

interface UseUrlParamsConfig<T> {
  onParams: (params: T) => void;
  parser: (searchParams: URLSearchParams) => T;
}

export function useUrlParams<T>({ onParams, parser }: UseUrlParamsConfig<T>) {
  // Capture the current callbacks at mount time to preserve mount-only semantics
  // while avoiding stale closures
  const onParamsRef = useRef(onParams);
  const parserRef = useRef(parser);

  // Update refs on each render so the effect uses the latest versions
  useEffect(() => {
    onParamsRef.current = onParams;
    parserRef.current = parser;
  });

  // Run only on mount - uses refs to access current callback versions
  useEffect(() => {
    try {
      const searchParams = navigationService.getCurrentSearch();
      const parsed = parserRef.current(searchParams);
      onParamsRef.current(parsed);
    } catch (error) {
      // Silently handle errors
    }
    // Only run on mount - refs ensure we use the latest callbacks
    // without triggering re-runs when they change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
