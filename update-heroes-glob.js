const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src', 'app');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir(srcDir, fullPath => {
  if (!fullPath.endsWith('page.tsx')) return;
  
  // Skip home page and layout
  if (fullPath === path.join(srcDir, 'page.tsx')) return;
  if (fullPath === path.join(srcDir, 'layout.tsx')) return;

  let content = fs.readFileSync(fullPath, 'utf8');

  // Skip if already has HeroBanner imported
  if (content.includes(`import HeroBanner`)) {
    return;
  }

  // 1. Add import statement
  const importString = `\nimport HeroBanner from '@/components/HeroBanner';\n`;
  if (content.includes(`import Breadcrumbs from '@/components/Breadcrumbs';`)) {
    content = content.replace(`import Breadcrumbs from '@/components/Breadcrumbs';`, `import Breadcrumbs from '@/components/Breadcrumbs';${importString}`);
  } else if (content.includes(`import Link from 'next/link';`)) {
    content = content.replace(`import Link from 'next/link';`, `import Link from 'next/link';${importString}`);
  } else {
    // Just inject at line 2
    const lines = content.split('\n');
    let insertIndex = lines.findIndex(l => l.includes('import '));
    if (insertIndex === -1) insertIndex = 0;
    lines.splice(insertIndex + 1, 0, importString.trim());
    content = lines.join('\n');
  }

  // 2. Wrap section and inject HeroBanner
  const sectionRegex = /<section className="([^"]*(?:bg-gradient-hero|bg-secondary|bg-primary\/90)[^"]*)">/g;
  let match;
  let modified = false;

  while ((match = sectionRegex.exec(content)) !== null) {
    if (!modified) { // Only do the first matching section
      const fullMatch = match[0];
      const classes = match[1];
      
      let newClasses = classes
        .replace('bg-gradient-hero', '')
        .replace('bg-secondary', '')
        .replace('bg-primary/90', '')
        .replace(/\s+/g, ' ')
        .trim();
        
      if (!newClasses.includes('relative')) newClasses = 'relative ' + newClasses;
      if (!newClasses.includes('overflow-hidden')) newClasses += ' overflow-hidden';

      const replacementSection = `<section className="${newClasses}">\n        <HeroBanner hideDots />`;
      
      content = content.slice(0, match.index) + replacementSection + content.slice(match.index + fullMatch.length);
      
      const divRegex = /<HeroBanner hideDots \/>\s*<div className="([^"]*)"/g;
      const divMatch = divRegex.exec(content);
      if (divMatch) {
         let divClasses = divMatch[1];
         if (!divClasses.includes('z-10')) {
             divClasses = 'relative z-10 ' + divClasses;
         }
         content = content.replace(divMatch[0], `<HeroBanner hideDots />\n        <div className="${divClasses}"`);
      }

      modified = true;
    }
  }

  if (modified) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`Updated: ${fullPath}`);
  }
});
