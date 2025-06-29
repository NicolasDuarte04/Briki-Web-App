#!/usr/bin/env node

/**
 * Setup script for testing real SURA plans
 * Run this to configure the app to use real plans instead of mock plans
 */

const fs = require('fs');
const path = require('path');

// Create .env file with real plans configuration
const envContent = `# Briki Client Environment Variables

# Plan Source Configuration
# Set to false to use real plans from realPlans.ts
VITE_USE_MOCK_PLANS=false

# Set to true to show both mock and real plans (testing mode)
VITE_ENABLE_MIXED_PLANS=false

# Other configurations can be added here as needed
`;

const envPath = path.join(__dirname, '.env');

try {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env file with real plans configuration');
  console.log('📍 Location:', envPath);
  console.log('\n🚀 Next steps:');
  console.log('1. Run: npm run dev');
  console.log('2. Navigate to /ask-briki');
  console.log('3. Ask about auto insurance to see SURA plans');
  console.log('\n💡 To switch back to mock plans:');
  console.log('   - Delete the .env file, or');
  console.log('   - Set VITE_USE_MOCK_PLANS=true');
} catch (error) {
  console.error('❌ Error creating .env file:', error.message);
  console.log('\n🔧 Manual setup:');
  console.log('1. Create client/.env file');
  console.log('2. Add: VITE_USE_MOCK_PLANS=false');
  console.log('3. Add: VITE_ENABLE_MIXED_PLANS=false');
} 