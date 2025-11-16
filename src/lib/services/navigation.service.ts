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
  private checkBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  navigate(url: string): void {
    if (!this.checkBrowser()) return;
    window.location.assign(url);
  }

  openInNewTab(url: string): void {
    if (!this.checkBrowser()) return;
    // Prevent reverse tabnabbing attacks by using noopener and noreferrer
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    // Fallback for older browsers that don't support noopener
    if (newWindow) {
      newWindow.opener = null;
    }
  }

  replaceState(url: string): void {
    if (!this.checkBrowser()) return;
    window.history.replaceState({}, '', url);
  }

  getCurrentSearch(): URLSearchParams {
    if (!this.checkBrowser()) return new URLSearchParams();
    return new URLSearchParams(window.location.search);
  }

  getCurrentPathname(): string {
    if (!this.checkBrowser()) return '';
    return window.location.pathname;
  }
}

// Singleton instance
export const navigationService: INavigationService = new BrowserNavigationService();
