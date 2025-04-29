/**
 * Entry point for Briki Travel Insurance app in web mode
 * This file is used when running the app in a web browser environment (like Replit)
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import WebApp from './src/WebApp';

// Create root element if it doesn't exist
let rootElement = document.getElementById('root');
if (!rootElement) {
  rootElement = document.createElement('div');
  rootElement.id = 'root';
  document.body.appendChild(rootElement);
}

// Add basic styles to ensure full-screen rendering
const style = document.createElement('style');
style.textContent = `
  html, body, #root {
    height: 100%;
    margin: 0;
    padding: 0;
    font-family: 'Inter', system-ui, sans-serif;
  }
  
  * {
    box-sizing: border-box;
  }
`;
document.head.appendChild(style);

// Render the app
const root = createRoot(rootElement);
root.render(<WebApp />);

// Log startup message
console.log('🌐 Briki Travel Insurance Web App started');
console.log('📝 Note: This is a web-compatible version for development in Replit');
console.log('📱 For full mobile features, use the Expo Go app on a mobile device');