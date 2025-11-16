/**
 * useUrlParams - Responsible for reading URL parameters on mount
 * Follows Single Responsibility Principle (SRP) and Dependency Inversion Principle (DIP)
 */

import { useEffect } from 'react';
import { navigationService } from '@/lib/services';

interface UseUrlParamsConfig<T> {
  onParams: (params: T) => void;
  parser: (searchParams: URLSearchParams) => T;
}

export function useUrlParams<T>({ onParams, parser }: UseUrlParamsConfig<T>) {
  useEffect(() => {
    try {
      const searchParams = navigationService.getCurrentSearch();
      const parsed = parser(searchParams);
      onParams(parsed);
    } catch (error) {
      // Silently handle errors
    }
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
