/**
 * HTTP Service - Abstracts fetch operations
 * Follows Dependency Inversion Principle (DIP)
 *
 * IMPORTANT: Type Safety
 * This service performs NO runtime validation of response data.
 * The generic type parameter T is a compile-time hint only.
 *
 * Callers MUST handle the possibility of malformed responses by:
 * 1. Wrapping calls in try/catch blocks
 * 2. Validating response data structure before use
 * 3. Using runtime validation libraries (Zod, io-ts) for critical data
 *
 * IMPORTANT: Timeout Behavior
 * All requests have a default timeout of 30 seconds to prevent hanging.
 * Customize timeout per-request via the options parameter.
 * TimeoutError is thrown when requests exceed the timeout duration.
 *
 * Example safe usage:
 * ```ts
 * try {
 *   const data = await httpService.get<MyType>('/api/data', { timeout: 5000 });
 *   // Validate data structure before using
 *   if (!data || typeof data.property !== 'string') {
 *     throw new Error('Invalid response structure');
 *   }
 *   // Safe to use data now
 * } catch (error) {
 *   if (error instanceof TimeoutError) {
 *     // Handle timeout specifically
 *   }
 *   // Handle other errors appropriately
 * }
 * ```
 */

/**
 * Custom error for request timeouts
 */
export class TimeoutError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TimeoutError';
  }
}

export interface HttpRequestOptions {
  /** Timeout in milliseconds. Default: 30000 (30 seconds) */
  timeout?: number;
}

export interface IHttpService {
  get<T>(url: string, options?: HttpRequestOptions): Promise<T>;
  post<T, D>(url: string, data: D, options?: HttpRequestOptions): Promise<T>;
}

class FetchHttpService implements IHttpService {
  private readonly DEFAULT_TIMEOUT = 30000; // 30 seconds

  async get<T>(url: string, options?: HttpRequestOptions): Promise<T> {
    const timeout = options?.timeout ?? this.DEFAULT_TIMEOUT;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error for ${url}: status ${response.status}`);
      }

      // Keep timeout active during JSON parsing to prevent hanging
      const data = await response.json();

      // Clear timeout only after entire operation completes
      clearTimeout(timeoutId);

      return data as T;
    } catch (error) {
      // Always clear timeout on error to prevent timer leaks
      clearTimeout(timeoutId);

      if (error instanceof Error && error.name === 'AbortError') {
        throw new TimeoutError(`Request to ${url} timed out after ${timeout}ms`);
      }

      throw error;
    }
  }

  async post<T, D>(url: string, data: D, options?: HttpRequestOptions): Promise<T> {
    const timeout = options?.timeout ?? this.DEFAULT_TIMEOUT;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error for ${url}: status ${response.status}`);
      }

      // Keep timeout active during JSON parsing to prevent hanging
      const result = await response.json();

      // Clear timeout only after entire operation completes
      clearTimeout(timeoutId);

      return result as T;
    } catch (error) {
      // Always clear timeout on error to prevent timer leaks
      clearTimeout(timeoutId);

      if (error instanceof Error && error.name === 'AbortError') {
        throw new TimeoutError(`Request to ${url} timed out after ${timeout}ms`);
      }

      throw error;
    }
  }
}

// Singleton instance
export const httpService: IHttpService = new FetchHttpService();
