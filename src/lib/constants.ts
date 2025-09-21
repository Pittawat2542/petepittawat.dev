/**
 * Application-wide constants and configuration
 * Centralized location for all constants used across the application
 */

// Site configuration (merged from consts.ts)
export const SITE_CONFIG = {
  TITLE: 'PETEPITTAWAT.DEV',
  DESCRIPTION:
    "Pete (Pittawat Taveekitworachai) — research scientist and full-stack developer exploring large language models, prompt engineering, reasoning, and practical AI systems. Writing, projects, publications, and talks.",
  AUTHOR: 'Pittawat Taveekitworachai',
} as const;

// Re-export for backward compatibility
export const SITE_TITLE = SITE_CONFIG.TITLE;
export const SITE_DESCRIPTION = SITE_CONFIG.DESCRIPTION;

// Legacy constants for backward compatibility
export const FIRST_AUTHOR_TITLE = 'First Author Publications';

// Theme and UI Configuration
export const UI_CONFIG = {
  // Animation durations (in milliseconds)
  ANIMATION: {
    FAST: 150,
    NORMAL: 250,
    SLOW: 400,
  },
  
  // Common sizes used throughout the application
  SIZES: {
    ICON: {
      SM: 12,
      MD: 16,
      LG: 20,
      XL: 24,
    },
    BORDER_RADIUS: {
      SM: '4px',
      MD: '8px',
      LG: '12px',
      XL: '16px',
      FULL: '9999px',
    },
  },
  
  // Z-index levels for consistent layering
  Z_INDEX: {
    DROPDOWN: 1000,
    MODAL: 1100,
    TOOLTIP: 1200,
    NOTIFICATION: 1300,
  },
} as const;

// Component specific configuration
export const COMPONENT_CONFIG = {
  // Filter and search configuration
  FILTER: {
    DEBOUNCE_DELAY: 300,
    MIN_SEARCH_LENGTH: 2,
    MAX_SEARCH_LENGTH: 100,
    MAX_RESULTS: 50,
    MAX_RECENT_SEARCHES: 5,
  },
  
  // Pagination defaults
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 12,
    PAGE_SIZE_OPTIONS: [6, 12, 24, 48] as const,
  },
  
  // Performance optimization
  PERFORMANCE: {
    INTERSECTION_THRESHOLD: 0.1,
    INTERSECTION_ROOT_MARGIN: '50px',
    LAZY_LOAD_THRESHOLD: 2,
  },
} as const;

// API and external service configuration
export const API_CONFIG = {
  // Request timeouts
  TIMEOUT: {
    SHORT: 5000,   // 5 seconds
    MEDIUM: 15000, // 15 seconds
    LONG: 30000,   // 30 seconds
  },
  
  // Retry configuration
  RETRY: {
    MAX_ATTEMPTS: 3,
    BACKOFF_MULTIPLIER: 2,
    INITIAL_DELAY: 1000,
  },
} as const;

// Validation constants
export const VALIDATION = {
  // String length limits
  LENGTH: {
    MIN_SEARCH_QUERY: 1,
    MAX_SEARCH_QUERY: 100,
    MAX_TAG_LENGTH: 50,
    MAX_TITLE_LENGTH: 200,
  },
  
  // File size limits (in bytes)
  FILE_SIZE: {
    MAX_IMAGE: 5 * 1024 * 1024, // 5MB
    MAX_DOCUMENT: 10 * 1024 * 1024, // 10MB
  },
} as const;

// Application routes and navigation
export const ROUTES = {
  HOME: '/',
  BLOG: '/blog',
  PROJECTS: '/projects',
  PUBLICATIONS: '/publications',
  TALKS: '/talks',
  ABOUT: '/about',
  SEARCH: '/search',
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  THEME: 'app-theme',
  RECENT_SEARCHES: 'recent-searches',
  USER_PREFERENCES: 'user-preferences',
  FILTER_STATE: 'filter-state',
} as const;

// Error messages
export const ERROR_MESSAGES = {
  GENERIC: 'An unexpected error occurred. Please try again.',
  NETWORK: 'Network error. Please check your connection and try again.',
  NOT_FOUND: 'The requested resource was not found.',
  INVALID_INPUT: 'Please check your input and try again.',
  SEARCH_FAILED: 'Search request failed. Please try again.',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  COPIED: 'Copied to clipboard!',
  SAVED: 'Settings saved successfully!',
  SEARCH_CLEARED: 'Search history cleared!',
} as const;

// SEO and meta defaults
export const SEO_DEFAULTS = {
  TITLE_SUFFIX: ' | Pittawat Taveekitworachai',
  DESCRIPTION: 'Personal website and portfolio of Pittawat Taveekitworachai',
  KEYWORDS: ['portfolio', 'academic', 'research', 'publications', 'projects'],
  AUTHOR: 'Pittawat Taveekitworachai',
  TYPE: 'website',
  LOCALE: 'en_US',
} as const;

// Feature flags (for easy feature toggling)
export const FEATURE_FLAGS = {
  ENABLE_SEARCH: true,
  ENABLE_DARK_MODE: true,
  ENABLE_ANIMATIONS: true,
  ENABLE_ANALYTICS: false,
  ENABLE_EXPERIMENTAL_FEATURES: false,
} as const;

// Export all constants as a single object for easier importing
export const CONSTANTS = {
  SITE_CONFIG,
  UI_CONFIG,
  COMPONENT_CONFIG,
  API_CONFIG,
  VALIDATION,
  ROUTES,
  STORAGE_KEYS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  SEO_DEFAULTS,
  FEATURE_FLAGS,
} as const;

// Type helpers for better TypeScript support
export type Route = typeof ROUTES[keyof typeof ROUTES];
export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];
export type ErrorMessage = typeof ERROR_MESSAGES[keyof typeof ERROR_MESSAGES];