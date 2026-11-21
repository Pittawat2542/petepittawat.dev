import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const readJson = url => JSON.parse(readFileSync(new URL(url, import.meta.url), 'utf8'));
const { dependencies, devDependencies } = readJson('../package.json');
const packageNames = Object.keys({ ...dependencies, ...devDependencies });
const run = (...args) => {
  console.log(`\n$ pnpm ${args.join(' ')}`);
  execFileSync('pnpm', args, { stdio: 'inherit' });
};

run('update', '--latest', ...packageNames.filter(name => name !== 'typescript'));
// Astro check currently accepts ^5.0.0 || ^6.0.0 and the TypeScript ESLint parser
// accepts >=4.8.4 <6.1.0. Check both peers before widening this range.
run('update', 'typescript');
for (const name of ['@astrojs/check', '@typescript-eslint/parser']) {
  const { peerDependencies } = readJson(`../node_modules/${name}/package.json`);
  console.log(`${name} supports TypeScript ${peerDependencies.typescript}`);
}

run('lint');
run('test:content');
run('build');
