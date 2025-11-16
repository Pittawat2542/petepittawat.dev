/**
 * Navigation Service - Abstracts browser navigation operations
 * Follows Dependency Inversion Principle (DIP)
 */

export interface INavigationService {
  navigate(url: string): void;
  openInNewTab(url: string): void;
  replaceState(url: string): void;
  getCurrentSearch(): URLSearchParams;
  getCurrentPathname(): string;
}

class BrowserNavigationService implements INavigationService {
  navigate(url: string): void {
    window.location.assign(url);
  }

  openInNewTab(url: string): void {
    window.open(url, '_blank');
  }

  replaceState(url: string): void {
    window.history.replaceState({}, '', url);
  }

  getCurrentSearch(): URLSearchParams {
    return new URLSearchParams(window.location.search);
  }

  getCurrentPathname(): string {
    return window.location.pathname;
  }
}

// Singleton instance
export const navigationService: INavigationService = new BrowserNavigationService();
