# Husky Git Hooks

This project uses Husky to manage Git hooks, specifically a pre-commit hook that automatically formats staged files using Prettier.

## How it works

When you commit changes, the pre-commit hook will automatically run `lint-staged` which in turn runs Prettier on all staged files that match the configured patterns.

## Configuration

The pre-commit hook is configured in:

- [.husky/pre-commit](file:///Users/pittawat/projects/petepittawat.dev/.husky/pre-commit) - The hook script
- [package.json](file:///Users/pittawat/projects/petepittawat.dev/package.json) - Contains the `lint-staged` configuration

## File patterns

The following file patterns will be automatically formatted on commit:

- `*.ts`
- `*.tsx`
- `*.astro`
- `*.json`
- `*.md`
- `*.css`
- `*.js`
- `*.yml`
- `*.yaml`

## Manual formatting

You can also manually format files using:

```bash
# Format all files in the project
pnpm format

# Check formatting without making changes
pnpm format:check
```
