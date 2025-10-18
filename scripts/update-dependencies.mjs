#!/usr/bin/env node

/**
 * Script to safely update project dependencies
 * This script updates dependencies in a controlled manner with proper validation
 */

import { readFileSync, writeFileSync } from 'fs';

import { execSync } from 'child_process';

console.log('🔍 Checking for outdated dependencies...\n');

try {
  // Get current outdated dependencies
  const outdatedOutput = execSync('pnpm outdated', { encoding: 'utf8' });
  console.log(outdatedOutput);
  
  // Update all dependencies
  console.log('🔄 Updating dependencies...\n');
  execSync('pnpm update', { stdio: 'inherit' });
  
  // Run tests to ensure everything still works
  console.log('🧪 Running tests...\n');
  execSync('pnpm run lint', { stdio: 'inherit' });
  execSync('pnpm run type-check', { stdio: 'inherit' });
  
  console.log('✅ Dependencies updated successfully!\n');
  console.log('📋 Next steps:');
  console.log('1. Review the changes in package.json and pnpm-lock.yaml');
  console.log('2. Test the application locally with `pnpm dev`');
  console.log('3. If everything works, commit the changes');
  
} catch (error) {
  console.error('❌ Error updating dependencies:', error.message);
  process.exit(1);
}