/**
 * Header script functionality
 * Handles scroll state, mobile menu, and search initialization
 */

import { createScrollController, type ScrollController } from './header/scrollController';
import { createMenuController, type MenuController } from './header/menuController';
import { createSearchController, type SearchController } from './header/searchController';

export interface HeaderController {
  init(): void;
  cleanup(): void;
}

export function createHeaderController(): HeaderController {
  let isInitialized = false;
  
  // Controller instances
  let scrollController: ScrollController | null = null;
  let menuController: MenuController | null = null;
  let searchController: SearchController | null = null;
  let searchCleanup: (() => void) | null = null;

  const init = () => {
    if (isInitialized) return;
    
    // Initialize controllers
    scrollController = createScrollController();
    menuController = createMenuController();
    searchController = createSearchController();
    
    // Start all controllers
    scrollController.init();
    menuController.init();
    searchCleanup = searchController.init();

    isInitialized = true;
  };

  const cleanup = () => {
    if (!isInitialized) return;
    
    // Cleanup all controllers
    scrollController?.cleanup();
    menuController?.cleanup();
    searchCleanup?.();

    // Clear references
    scrollController = null;
    menuController = null;
    searchController = null;
    searchCleanup = null;

    isInitialized = false;
  };

  return {
    init,
    cleanup
  };
}

// Auto-initialize when DOM is ready
let headerController: HeaderController | null = null;

function initializeHeader() {
  if (headerController) return;
  
  headerController = createHeaderController();
  headerController.init();
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeHeader, { once: true });
} else {
  initializeHeader();
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  if (headerController) {
    headerController.cleanup();
    headerController = null;
  }
});