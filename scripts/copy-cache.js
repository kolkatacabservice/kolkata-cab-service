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
// NOTE: Must use `_next_cache/` — NOT `cdn-cgi/_next_cache/`.
// Cloudflare intercepts all /cdn-cgi/ paths at the CDN layer, so ASSETS.fetch()
// cannot retrieve files stored there. Using _next_cache/ bypasses this restriction.
const targetDir = path.join(__dirname, '../.open-next/assets/_next_cache');

if (fs.existsSync(sourceDir)) {
  console.log(`Copying cache from ${sourceDir} to ${targetDir}...`);
  copyFolderSync(sourceDir, targetDir);
  console.log('Cache copied successfully!');
} else {
  console.warn('No cache folder found to copy.');
}
