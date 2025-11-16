/**
 * Storage Service - Abstracts localStorage operations
 * Follows Dependency Inversion Principle (DIP)
 */

export interface IStorageService {
  getItem<T>(key: string): T | null;
  setItem<T>(key: string, value: T): void;
  removeItem(key: string): void;
}

class LocalStorageService implements IStorageService {
  getItem<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  }

  setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Silently handle quota exceeded or other errors
    }
  }

  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch {
      // Silently handle errors
    }
  }
}

// Singleton instance
export const storageService: IStorageService = new LocalStorageService();
