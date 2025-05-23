// A simplified build script for Replit deployment
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

// Make sure the dist directory exists
if (!fs.existsSync('./dist')) {
  fs.mkdirSync('./dist', { recursive: true });
}

if (!fs.existsSync('./dist/public')) {
  fs.mkdirSync('./dist/public', { recursive: true });
}

// Create a minimal index.html file that redirects to our server
const indexHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Briki Insurance Platform</title>
  <meta http-equiv="refresh" content="0;url=/">
</head>
<body>
  <p>Redirecting to app...</p>
</body>
</html>
`;

fs.writeFileSync('./dist/public/index.html', indexHTML);

// Build the server-side code
console.log('Building server-side code...');
exec('esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist', 
  (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.log('Build completed successfully!');
  }
);