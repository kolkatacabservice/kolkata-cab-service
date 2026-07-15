const fs = require('fs');
const path = require('path');

function copyFolderSync(from, to) {
  if (!fs.existsSync(from)) return;
  fs.mkdirSync(to, { recursive: true });
  fs.readdirSync(from).forEach(element => {
    const fromPath = path.join(from, element);
    const toPath = path.join(to, element);
    if (fs.lstatSync(fromPath).isDirectory()) {
      copyFolderSync(fromPath, toPath);
    } else {
      fs.copyFileSync(fromPath, toPath);
    }
  });
}

const sourceDir = path.join(__dirname, '../.open-next/cache');
const targetDir = path.join(__dirname, '../.open-next/assets/cdn-cgi/_next_cache');

if (fs.existsSync(sourceDir)) {
  console.log(`Copying cache from ${sourceDir} to ${targetDir}...`);
  copyFolderSync(sourceDir, targetDir);
  console.log('Cache copied successfully!');
} else {
  console.warn('No cache folder found to copy.');
}
