#!/usr/bin/env node

import { execSync } from 'node:child_process';

const upgradeGroups = [
  {
    name: 'Astro core',
    packages: [
      'astro',
      '@astrojs/check',
      '@astrojs/mdx',
      '@astrojs/react',
      '@astrojs/rss',
      '@astrojs/sitemap',
    ],
  },
  {
    name: 'Runtime packages',
    packages: [
      '@lucide/astro',
      'lucide-react',
      'react',
      'react-dom',
      'framer-motion',
      'katex',
      'sharp',
      'tailwindcss',
      '@tailwindcss/vite',
      'tailwind-merge',
    ],
  },
  {
    name: 'Tooling',
    packages: [
      'typescript',
      'eslint',
      '@eslint/js',
      '@typescript-eslint/eslint-plugin',
      '@typescript-eslint/parser',
      'eslint-plugin-astro',
      'eslint-plugin-react',
      'eslint-plugin-react-hooks',
      '@types/react',
      '@types/react-dom',
      '@types/katex',
      'prettier',
      'prettier-plugin-tailwindcss',
      'lint-staged',
    ],
  },
];

function run(command, options = {}) {
  console.log(`\n$ ${command}`);
  execSync(command, { stdio: 'inherit', ...options });
}

function runOptional(command) {
  try {
    run(command);
  } catch (error) {
    console.warn(`\nSkipping optional step after failure: ${command}`);
    if (error instanceof Error) {
      console.warn(error.message);
    }
  }
}

console.log('Checking outdated dependencies...');
runOptional('pnpm outdated');

for (const group of upgradeGroups) {
  console.log(`\n=== ${group.name} ===`);
  run(`pnpm up -L ${group.packages.join(' ')}`);
  run('pnpm lint');
  run('pnpm build');
}

console.log('\nDependency update workflow complete.');
console.log('Review package.json and pnpm-lock.yaml before committing.');
