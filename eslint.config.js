import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import astroPlugin from 'eslint-plugin-astro';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactPlugin from '@eslint-react/eslint-plugin';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';

const browserGlobals = {
  document: 'readonly',
  window: 'readonly',
  navigator: 'readonly',
  console: 'readonly',
  setTimeout: 'readonly',
  clearTimeout: 'readonly',
  setInterval: 'readonly',
  clearInterval: 'readonly',
  localStorage: 'readonly',
  sessionStorage: 'readonly',
  requestAnimationFrame: 'readonly',
  cancelAnimationFrame: 'readonly',
  fetch: 'readonly',
  IntersectionObserver: 'readonly',
  MutationObserver: 'readonly',
  matchMedia: 'readonly',
  KeyboardEvent: 'readonly',
  HTMLElement: 'readonly',
  HTMLAnchorElement: 'readonly',
  HTMLButtonElement: 'readonly',
  HTMLInputElement: 'readonly',
  HTMLDivElement: 'readonly',
  HTMLTextAreaElement: 'readonly',
  ResizeObserver: 'readonly',
  Event: 'readonly',
};

const reactRules = {
  '@eslint-react/no-missing-key': 'error',
  '@eslint-react/jsx-no-comment-textnodes': 'error',
  '@eslint-react/jsx-no-children-prop': 'error',
  '@eslint-react/dom-no-unsafe-target-blank': 'error',
  '@eslint-react/dom-no-dangerously-set-innerhtml-with-children': 'error',
  '@eslint-react/dom-no-unknown-property': 'error',
  '@eslint-react/no-direct-mutation-state': 'error',
  '@eslint-react/dom-no-find-dom-node': 'error',
  '@eslint-react/dom-no-render-return-value': 'error',
  '@eslint-react/no-unsafe-component-will-mount': 'error',
  '@eslint-react/no-unsafe-component-will-receive-props': 'error',
  '@eslint-react/no-unsafe-component-will-update': 'error',
};

export default [
  {
    ignores: [
      'dist/',
      '.astro/',
      'node_modules/',
      'public/',
      '*.config.js',
      '*.config.mjs',
      '.eslintrc.cjs',
      'scripts/',
    ],
  },
  js.configs.recommended,
  ...astroPlugin.configs['flat/recommended'],
  {
    files: ['**/*.{ts,tsx,mts,cts}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: browserGlobals,
    },
    plugins: {
      '@typescript-eslint': typescriptPlugin,
      '@eslint-react': reactPlugin,
      'react-hooks': reactHooksPlugin,
    },
    rules: {
      ...reactRules,

      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/consistent-type-assertions': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/prefer-readonly': 'warn',
      '@typescript-eslint/no-confusing-void-expression': 'warn',
      '@typescript-eslint/prefer-nullish-coalescing': 'warn',
      '@typescript-eslint/prefer-optional-chain': 'warn',

      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      'no-unused-vars': 'off',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },
  {
    files: ['**/*.{js,jsx,mjs,cjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: browserGlobals,
    },
    plugins: {
      '@eslint-react': reactPlugin,
    },
    rules: {
      ...reactRules,

      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },
  {
    files: ['**/*.astro'],
    languageOptions: {
      globals: browserGlobals,
    },
    rules: {
      'astro/no-conflict-set-directives': 'error',
      'astro/no-unused-define-vars-in-style': 'error',
    },
  },
];
