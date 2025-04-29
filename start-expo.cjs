/**
 * Script to start the Expo app from Replit
 */

const { spawn } = require('child_process');
const path = require('path');

// Clear console
console.clear();

// Display Briki Travel Insurance header
console.log('\n===================================');
console.log('🧳 Briki Travel Insurance Mobile App 🧳');
console.log('===================================\n');

console.log('Starting Expo development server...\n');

console.log('This will generate a QR code that you can scan with the Expo Go app.');
console.log('If you\'re on a mobile device, you can type the URL manually in Expo Go.\n');

// Start the Expo server using our custom script
const expo = spawn('node', ['./mobile-app/run-expo.js'], {
  stdio: 'inherit',
  cwd: process.cwd()
});

expo.on('error', (err) => {
  console.error('Failed to start Expo:', err);
});

console.log('\n❗ Press CTRL+C to stop the server');