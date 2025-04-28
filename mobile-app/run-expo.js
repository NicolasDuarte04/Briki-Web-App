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

// Create a URL to be used for the QR code
const url = `exp://${serverIP}:19000`;

// Display Briki Travel Insurance header
console.log('\n===================================');
console.log('🧳 Briki Travel Insurance Mobile App 🧳');
console.log('===================================\n');

console.log('Starting Expo development server...\n');

// Show the QR code for direct scanning
console.log('\n📱 Scan this QR code with the Expo Go app on your phone:');
qrcode.generate(url, { small: true });

console.log(`\n📋 Or manually enter this URL in Expo Go: ${url}`);
console.log('\n🔧 Expo server is starting on port 19000...');

// Start the Expo server
const expo = spawn('npx', ['expo', 'start', '--port', '19000'], {
  stdio: 'inherit',
  cwd: __dirname
});

expo.on('error', (err) => {
  console.error('Failed to start Expo:', err);
});

console.log('\n❗ Press CTRL+C to stop the server');