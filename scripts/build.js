#!/usr/bin/env node

/**
 * Build script for Briki Insurance Platform
 * Handles both frontend and backend build processes
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Building Briki Insurance Platform...');

try {
  // Build frontend
  console.log('📦 Building frontend...');
  execSync('npm run build', { stdio: 'inherit' });
  
  console.log('✅ Build completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}