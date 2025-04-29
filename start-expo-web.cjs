/**
 * Script to start the Expo app in web mode for Replit environment
 * This file uses CommonJS format to avoid ESM issues
 */
const path = require('path');
const { spawn } = require('child_process');

console.log('🌐 Starting Briki Travel Insurance App in Web Mode...');
console.log('📝 This is a Replit-compatible version with web fallbacks');
console.log('⏳ Please wait while the application builds...');

// Run the Expo app in web mode
const expo = spawn('node', ['mobile-app/run-expo.js'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    EXPO_PUBLIC_PLATFORM: 'web'
  }
});

expo.on('error', (err) => {
  console.error('Failed to start Expo:', err);
});

console.log('❗ Press CTRL+C to stop the Expo server');