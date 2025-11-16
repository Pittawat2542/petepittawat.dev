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
 * Example safe usage:
 * ```ts
 * try {
 *   const data = await httpService.get<MyType>('/api/data');
 *   // Validate data structure before using
 *   if (!data || typeof data.property !== 'string') {
 *     throw new Error('Invalid response structure');
 *   }
 *   // Safe to use data now
 * } catch (error) {
 *   // Handle errors appropriately
 * }
 * ```
 */

export interface IHttpService {
  get<T>(url: string): Promise<T>;
  post<T, D>(url: string, data: D): Promise<T>;
}

class FetchHttpService implements IHttpService {
  async get<T>(url: string): Promise<T> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json() as Promise<T>;
  }

  async post<T, D>(url: string, data: D): Promise<T> {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json() as Promise<T>;
  }
}

// Singleton instance
export const httpService: IHttpService = new FetchHttpService();
