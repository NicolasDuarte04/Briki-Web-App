#!/usr/bin/env node

/**
 * Script to run Expo from Replit
 * This script will start an Expo server and generate a QR code
 * that can be scanned with the Expo Go app.
 */

const { spawn } = require('child_process');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Get network interfaces to find the server IP
const networkInterfaces = os.networkInterfaces();
let serverIP = Object.keys(networkInterfaces)
  .map(ifname => networkInterfaces[ifname])
  .flat()
  .filter(iface => iface.family === 'IPv4' && !iface.internal)
  .map(iface => iface.address)[0];

if (!serverIP) {
  serverIP = 'localhost';
}

// Create URLs to be used for both native and web viewing
const nativeUrl = `exp://${serverIP}:19000`;
const webUrl = `http://${serverIP}:19006`;

// Display Briki Travel Insurance header
console.log('\n===================================');
console.log('🧳 Briki Travel Insurance Mobile App 🧳');
console.log('===================================\n');

console.log('Starting Expo development server...\n');

// Show the QR code for direct scanning
console.log('\n📱 Scan this QR code with the Expo Go app on your phone:');
qrcode.generate(nativeUrl, { small: true });

console.log(`\n📋 Native mode URL (for Expo Go): ${nativeUrl}`);
console.log(`\n🌐 Web mode URL (for browsers): ${webUrl}`);
console.log('\n🔧 Expo server is starting on port 19006...');

// Set WEB mode explicitly for Replit compatibility
console.log('\n🌐 Using Expo Web mode for Replit compatibility');

// Start the Expo server in web mode with development settings
const expo = spawn('npx', ['expo', 'start', '-c', '--web', '--port', '19006', '--dev', '--no-minify'], {
  stdio: 'inherit',
  cwd: __dirname,
  env: {
    ...process.env,
    EXPO_NO_UPDATES: 'true', // Disable updates check in development
    NODE_ENV: 'development',
    REACT_NATIVE_PACKAGER_HOSTNAME: serverIP, // Set explicit hostname
    EXPO_PACKAGER_PROXY_URL: `http://${serverIP}:19006`, // Force web URL
    EXPO_PUBLIC_PLATFORM: 'web'  // Tell the app we're in web mode
  }
});

expo.on('error', (err) => {
  console.error('Failed to start Expo:', err);
});

console.log('\n❗ Press CTRL+C to stop the server');