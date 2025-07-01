const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Configuration
const ROOT_DIR = path.join(__dirname, '..');
const CLIENT_SRC_DIR = path.join(ROOT_DIR, 'client', 'src');
const SERVER_DIR = path.join(ROOT_DIR, 'server');
const SHARED_DIR = path.join(ROOT_DIR, 'shared');

// Calculate relative path from source to target
function calculateRelativePath(fromFile, toPath) {
  const fromDir = path.dirname(fromFile);
  
  // Handle @/ imports (client/src)
  if (toPath.startsWith('@/')) {
    const targetPath = path.join(CLIENT_SRC_DIR, toPath.slice(2));
    let relativePath = path.relative(fromDir, targetPath);
    
    // Ensure we always use forward slashes and start with ./ or ../
    relativePath = relativePath.split(path.sep).join('/');
    if (!relativePath.startsWith('.')) {
      relativePath = './' + relativePath;
    }
    
    return relativePath;
  }
  
  // Handle @shared/ imports
  if (toPath.startsWith('@shared/')) {
    const targetPath = path.join(SHARED_DIR, toPath.slice(8));
    let relativePath = path.relative(fromDir, targetPath);
    
    // Ensure we always use forward slashes and start with ./ or ../
    relativePath = relativePath.split(path.sep).join('/');
    if (!relativePath.startsWith('.')) {
      relativePath = './' + relativePath;
    }
    
    return relativePath;
  }
  
  return toPath;
}

// Process a single file
function processFile(filePath) {
  console.log(`Processing: ${filePath}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Match all import statements with @/ or @shared/
  const importRegex = /^(import\s+(?:{[^}]+}|[^'"]+)\s+from\s+['"])(@\/[^'"]+|@shared\/[^'"]+)(['"]\s*;?)$/gm;
  
  content = content.replace(importRegex, (match, prefix, importPath, suffix) => {
    const relativePath = calculateRelativePath(filePath, importPath);
    if (relativePath !== importPath) {
      modified = true;
      console.log(`  Converting: ${importPath} → ${relativePath}`);
      return prefix + relativePath + suffix;
    }
    return match;
  });
  
  // Also handle dynamic imports
  const dynamicImportRegex = /(\bimport\s*\(\s*['"])(@\/[^'"]+|@shared\/[^'"]+)(['"]\s*\))/g;
  
  content = content.replace(dynamicImportRegex, (match, prefix, importPath, suffix) => {
    const relativePath = calculateRelativePath(filePath, importPath);
    if (relativePath !== importPath) {
      modified = true;
      console.log(`  Converting dynamic: ${importPath} → ${relativePath}`);
      return prefix + relativePath + suffix;
    }
    return match;
  });
  
  // Also handle require statements (for CommonJS)
  const requireRegex = /(\brequire\s*\(\s*['"])(@\/[^'"]+|@shared\/[^'"]+)(['"]\s*\))/g;
  
  content = content.replace(requireRegex, (match, prefix, importPath, suffix) => {
    const relativePath = calculateRelativePath(filePath, importPath);
    if (relativePath !== importPath) {
      modified = true;
      console.log(`  Converting require: ${importPath} → ${relativePath}`);
      return prefix + relativePath + suffix;
    }
    return match;
  });
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    return 1;
  }
  
  return 0;
}

// Main function
function convertImports() {
  console.log('Starting import conversion...\n');
  
  // Find all TypeScript and JavaScript files
  const patterns = [
    path.join(CLIENT_SRC_DIR, '**/*.{ts,tsx,js,jsx}'),
    path.join(SERVER_DIR, '**/*.{ts,tsx,js,jsx}')
  ];
  
  let totalFiles = 0;
  let modifiedFiles = 0;
  
  patterns.forEach(pattern => {
    const files = glob.sync(pattern, {
      ignore: ['**/node_modules/**', '**/dist/**', '**/build/**']
    });
    
    files.forEach(file => {
      totalFiles++;
      modifiedFiles += processFile(file);
    });
  });
  
  console.log(`\nConversion complete!`);
  console.log(`Total files processed: ${totalFiles}`);
  console.log(`Files modified: ${modifiedFiles}`);
}

// Run the conversion
if (require.main === module) {
  convertImports();
}

module.exports = { convertImports, calculateRelativePath }; 