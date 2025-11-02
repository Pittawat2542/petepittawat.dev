/**
 * Application-wide constants
 * Only includes actively used configuration
 */

// Site configuration
export const SITE_CONFIG = {
  TITLE: 'PETEPITTAWAT.DEV',
  DESCRIPTION:
    'Pete (Pittawat Taveekitworachai) — research scientist and full-stack developer exploring large language models, prompt engineering, reasoning, and practical AI systems. Writing, projects, publications, and talks.',
  AUTHOR: 'Pittawat Taveekitworachai',
} as const;

// Re-export for backward compatibility
export const SITE_TITLE = SITE_CONFIG.TITLE;
export const SITE_DESCRIPTION = SITE_CONFIG.DESCRIPTION;
export const FIRST_AUTHOR_TITLE = 'First Author Publications';

// Component configuration
export const COMPONENT_CONFIG = {
  FILTER: {
    DEBOUNCE_DELAY: 300,
    MIN_SEARCH_LENGTH: 2,
    MAX_SEARCH_LENGTH: 100,
    MAX_RESULTS: 50,
    MAX_RECENT_SEARCHES: 5,
  },
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 12,
    PAGE_SIZE_OPTIONS: [6, 12, 24, 48] as const,
  },
  PERFORMANCE: {
    INTERSECTION_THRESHOLD: 0.1,
    INTERSECTION_ROOT_MARGIN: '50px',
    LAZY_LOAD_THRESHOLD: 2,
  },
} as const;

// Application routes
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
} as const;

// SEO defaults
export const SEO_DEFAULTS = {
  TITLE_SUFFIX: ' | Pittawat Taveekitworachai',
  DESCRIPTION: 'Personal website and portfolio of Pittawat Taveekitworachai',
  KEYWORDS: ['portfolio', 'academic', 'research', 'publications', 'projects'],
  AUTHOR: 'Pittawat Taveekitworachai',
  TYPE: 'website',
  LOCALE: 'en_US',
} as const;
