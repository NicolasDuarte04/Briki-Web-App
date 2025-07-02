const fs = require('fs');
const path = require('path');

// This script patches pdf-parse to work in production environments
// where the test PDF file doesn't exist

const pdfParseIndexPath = path.join(__dirname, '..', 'node_modules', 'pdf-parse', 'index.js');

if (fs.existsSync(pdfParseIndexPath)) {
  let content = fs.readFileSync(pdfParseIndexPath, 'utf8');
  
  // Replace the debug mode check to always be false in production
  const oldLine = "let isDebugMode = !module.parent;";
  const newLine = "let isDebugMode = false; // Patched for production";
  
  if (content.includes(oldLine)) {
    content = content.replace(oldLine, newLine);
    fs.writeFileSync(pdfParseIndexPath, content);
    console.log('✅ Successfully patched pdf-parse for production');
  } else if (content.includes(newLine)) {
    console.log('✅ pdf-parse already patched');
  } else {
    console.log('⚠️  Could not find the line to patch in pdf-parse');
  }
} else {
  console.log('⚠️  pdf-parse not found in node_modules');
} 