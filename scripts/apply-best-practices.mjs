#!/usr/bin/env node

/**
 * Script to apply React/TypeScript best practices to all TSX components
 * This script automatically refactors components to follow established patterns:
 * - Convert to named exports with memo
 * - Improve TypeScript interfaces with readonly modifiers
 * - Add proper error handling
 * - Standardize import patterns
 */

import { extname, join } from 'path';
import { readFileSync, readdirSync, statSync, writeFileSync } from 'fs';

const COMPONENTS_DIR = './src/components';

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
 * Apply best practices to a component file
 */
function refactorComponent(filePath) {
  console.log(`Refactoring: ${filePath}`);
  
  let content = readFileSync(filePath, 'utf-8');
  let modified = false;
  
  // Skip if already has memo import
  if (content.includes('memo') && content.includes('import')) {
    console.log(`  ✓ Already optimized`);
    return;
  }
  
  // 1. Add memo import if not present
  if (!content.includes('memo') && content.includes('export default function')) {
    // Add memo to React imports or create new import
    if (content.includes("import { ") && content.includes(" } from 'react'")) {
      content = content.replace(
        /import \{ ([^}]+) \} from 'react'/,
        (match, imports) => {
          const importList = imports.split(',').map(i => i.trim());
          if (!importList.includes('memo')) {
            importList.push('memo');
          }
          return `import { ${importList.join(', ')} } from 'react'`;
        }
      );
    } else if (content.includes("import React") || content.includes("from 'react'")) {
      // Add memo import after existing React import
      content = content.replace(
        /(import.*from 'react';?\n)/,
        '$1import { memo } from \'react\';\n'
      );
    } else {
      // Add memo import at the top
      content = `import { memo } from 'react';\n${content}`;
    }
    modified = true;
  }
  
  // 2. Convert function exports to memoized pattern
  const functionExportRegex = /export default function (\w+)\s*\(/;
  const match = RegExp(functionExportRegex).exec(content);
  
  if (match) {
    const componentName = match[1];
    
    // Replace export default function with const component
    content = content.replace(
      functionExportRegex,
      `const ${componentName}Component = (`
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
      // Add memo export and displayName
      const memoExport = [
        '',
        `// Memoized component for performance optimization`,
        `export const ${componentName} = memo(${componentName}Component);`,
        `${componentName}.displayName = '${componentName}';`,
        '',
        `// Default export for backward compatibility`,
        `export default ${componentName};`
      ];
      
      lines.splice(endLine + 1, 0, ...memoExport);
      content = lines.join('\n');
      modified = true;
    }
  }
  
  // 3. Add readonly to interface properties
  content = content.replace(
    /(interface\s+\w+\s*\{[^}]+)/g,
    (match) => {
      return match.replace(
        /(\n\s*)(\w+\??:\s*)/g,
        '$1readonly $2'
      );
    }
  );
  
  // 4. Add readonly to type properties
  content = content.replace(
    /(type\s+\w+\s*=\s*\{[^}]+)/g,
    (match) => {
      return match.replace(
        /(\n\s*)(\w+\??:\s*)/g,
        '$1readonly $2'
      );
    }
  );
  
  if (modified) {
    writeFileSync(filePath, content, 'utf-8');
    console.log(`  ✅ Refactored successfully`);
  } else {
    console.log(`  ℹ️  No changes needed`);
  }
}

/**
 * Main execution
 */
function main() {
  console.log('🚀 Applying React/TypeScript best practices to all components...\n');
  
  const tsxFiles = findTsxFiles(COMPONENTS_DIR);
  
  console.log(`Found ${tsxFiles.length} TSX files to process:\n`);
  
  for (const file of tsxFiles) {
    try {
      refactorComponent(file);
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error.message);
    }
  }
  
  console.log(`\n✨ Finished processing ${tsxFiles.length} components!`);
  console.log('\n📋 Next steps:');
  console.log('1. Run `npm run lint:fix` to fix any formatting issues');
  console.log('2. Run `npm run type-check` to verify TypeScript compliance');
  console.log('3. Test components to ensure functionality is preserved');
}

main();