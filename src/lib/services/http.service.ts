/**
 * HTTP Service - Abstracts fetch operations
 * Follows Dependency Inversion Principle (DIP)
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
