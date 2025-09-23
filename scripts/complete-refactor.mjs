#!/usr/bin/env node

/**
 * Complete refactoring script to apply React/TypeScript best practices
 * This script systematically applies the established patterns to all remaining components
 */

import { basename, extname, join } from 'path';
import { readFileSync, readdirSync, statSync, writeFileSync } from 'fs';

const COMPONENTS_DIR = './src/components';

// Components already refactored (skip these)
const COMPLETED_COMPONENTS = new Set([
  'AcademicServices.tsx',
  'AnimatedHeader.tsx',
  'BlogCard.tsx',
  'ErrorBoundary.tsx',
  'Filter.tsx',
  'FilterChip.tsx',
  'TagFilters.tsx',
  'SearchSkeleton.tsx',
  'Reveal.tsx',
  'HeaderLink.tsx',
]);

/**
 * Find all TSX files recursively
 */
function findTsxFiles(dir, files = []) {
  const items = readdirSync(dir);

  for (const item of items) {
    const fullPath = join(dir, item);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      findTsxFiles(fullPath, files);
    } else if (extname(item) === '.tsx') {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Check if component is already refactored
 */
function isAlreadyRefactored(content, fileName) {
  // Skip if already completed
  if (COMPLETED_COMPONENTS.has(fileName)) {
    return true;
  }

  // Check if already has our refactoring pattern
  return (
    content.includes('memo') &&
    content.includes('displayName') &&
    content.includes('readonly') &&
    content.includes('FC<')
  );
}

/**
 * Apply best practices to a component
 */
function refactorComponent(filePath) {
  const fileName = basename(filePath);
  console.log(`Processing: ${filePath}`);

  let content = readFileSync(filePath, 'utf-8');

  // Skip if already refactored
  if (isAlreadyRefactored(content, fileName)) {
    console.log(`  ✓ Already refactored`);
    return;
  }

  let modified = false;

  try {
    // 1. Add necessary imports
    if (!content.includes('import type { FC')) {
      content = content.replace(
        /(import[^;]+from\s+['"]react['"];?\n)/,
        "$1import type { FC } from 'react';\n"
      );
      modified = true;
    }

    if (!content.includes('import { memo')) {
      if (content.includes('import {') && content.includes("} from 'react'")) {
        content = content.replace(/import \{ ([^}]+) \} from 'react'/, (match, imports) => {
          const importList = imports.split(',').map(i => i.trim());
          if (!importList.includes('memo')) {
            importList.push('memo');
          }
          return `import { ${importList.join(', ')} } from 'react'`;
        });
      } else {
        content = content.replace(
          /(import.*from\s+['"]react['"];?\n)/,
          "$1import { memo } from 'react';\n"
        );
      }
      modified = true;
    }

    // 2. Update interfaces to use readonly
    content = content.replace(/(interface\s+\w+Props\s*\{[^}]*)/gs, match => {
      return match.replace(/(\n\s*)(\w+\??:\s*)/g, (lineMatch, indent, prop) => {
        if (prop.includes('readonly')) return lineMatch;
        return `${indent}readonly ${prop}`;
      });
    });

    // 3. Update type definitions
    content = content.replace(/(type\s+\w+Props\s*=\s*\{[^}]*)/gs, match => {
      return match.replace(/(\n\s*)(\w+\??:\s*)/g, (lineMatch, indent, prop) => {
        if (prop.includes('readonly')) return lineMatch;
        return `${indent}readonly ${prop}`;
      });
    });

    // 4. Convert export default function to memo pattern
    const functionExportMatch = RegExp(/export\s+default\s+function\s+(\w+)\s*\(/).exec(content);
    if (functionExportMatch) {
      const componentName = functionExportMatch[1];

      // Replace function declaration
      content = content.replace(
        /export\s+default\s+function\s+(\w+)\s*\(/,
        `const ${componentName}Component: FC<${componentName}Props> = (`
      );

      // Find the end of the function and add memo export
      const lines = content.split('\n');
      let braceCount = 0;
      let inFunction = false;
      let endLine = -1;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        if (line.includes(`const ${componentName}Component`)) {
          inFunction = true;
        }

        if (inFunction) {
          braceCount += (line.match(/\{/g) || []).length;
          braceCount -= (line.match(/\}/g) || []).length;

          if (braceCount === 0 && line.includes('}')) {
            endLine = i;
            break;
          }
        }
      }

      if (endLine !== -1) {
        // Add memo export
        const memoExport = [
          '',
          `// Memoized component for performance optimization`,
          `export const ${componentName} = memo(${componentName}Component);`,
          `${componentName}.displayName = '${componentName}';`,
          '',
          `// Default export for backward compatibility`,
          `export default ${componentName};`,
        ];

        lines.splice(endLine + 1, 0, ...memoExport);
        content = lines.join('\n');
        modified = true;
      }
    }

    // 5. Convert export function to memo pattern
    const namedExportMatch = RegExp(/export\s+function\s+(\w+)\s*\(/).exec(content);
    if (namedExportMatch) {
      const componentName = namedExportMatch[1];

      content = content.replace(
        /export\s+function\s+(\w+)\s*\(/,
        `const ${componentName}Component: FC<${componentName}Props> = (`
      );

      // Add memo export at the end
      if (!content.includes(`export const ${componentName} = memo`)) {
        content += `

// Memoized component for performance optimization
export const ${componentName} = memo(${componentName}Component);
${componentName}.displayName = '${componentName}';
`;
        modified = true;
      }
    }

    if (modified) {
      writeFileSync(filePath, content, 'utf-8');
      console.log(`  ✅ Refactored successfully`);
    } else {
      console.log(`  ℹ️  No changes needed`);
    }
  } catch (error) {
    console.error(`  ❌ Error processing: ${error.message}`);
  }
}

/**
 * Main execution
 */
function main() {
  console.log('🚀 Applying best practices to all remaining components...\n');

  const tsxFiles = findTsxFiles(COMPONENTS_DIR);
  const pendingFiles = tsxFiles.filter(file => {
    const fileName = basename(file);
    return !COMPLETED_COMPONENTS.has(fileName);
  });

  console.log(`Found ${pendingFiles.length} components to refactor:\n`);

  let processed = 0;
  let successful = 0;

  for (const file of pendingFiles) {
    try {
      refactorComponent(file);
      processed++;
      successful++;
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error.message);
      processed++;
    }
  }

  console.log(`\n✨ Completed processing ${processed}/${pendingFiles.length} components!`);
  console.log(`✅ Successfully refactored: ${successful}`);
  console.log(`❌ Failed: ${processed - successful}`);

  console.log('\n📋 Next steps:');
  console.log('1. Run `pnpm run lint:fix` to fix any formatting issues');
  console.log('2. Run `pnpm run type-check` to verify TypeScript compliance');
  console.log('3. Test components to ensure functionality is preserved');
  console.log('4. Run `pnpm run format` to apply consistent formatting');
}

main();
