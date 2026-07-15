const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src', 'app');

const filesToUpdate = [
  'about/page.tsx',
  'contact/page.tsx',
  'fleet/page.tsx',
  'routes/page.tsx',
  'routes/[route]/page.tsx',
  'services/page.tsx',
  'services/[service]/page.tsx',
  'tours/page.tsx',
  'tours/[tour]/page.tsx',
  '[state]/page.tsx',
  '[state]/[city]/page.tsx'
];

filesToUpdate.forEach(relativePath => {
  const fullPath = path.join(srcDir, relativePath);
  if (!fs.existsSync(fullPath)) {
    console.log(`Skipping: ${fullPath} - does not exist.`);
    return;
  }

  let content = fs.readFileSync(fullPath, 'utf8');

  // Skip if already has HeroBanner imported
  if (content.includes(`import HeroBanner`)) {
    console.log(`Skipping: ${fullPath} - already has HeroBanner.`);
    return;
  }

  // 1. Add import statement
  // We'll place it right after standard module imports but before local components
  // Or simply prepend it if we have 'use client', else below 'use client'
  
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
  // Different variants of the Hero section background string
  const sectionRegex = /<section className="([^"]*(?:bg-gradient-hero|bg-secondary|bg-primary\/90)[^"]*)">/g;
  let match;
  let modified = false;

  while ((match = sectionRegex.exec(content)) !== null) {
    if (!modified) { // Only do the first matching section (the top hero)
      const fullMatch = match[0];
      const classes = match[1];
      
      // Remove bg-gradient-hero and bg-secondary
      let newClasses = classes
        .replace('bg-gradient-hero', '')
        .replace('bg-secondary', '')
        .replace('bg-primary/90', '')
        .replace(/\s+/g, ' ')
        .trim();
        
      if (!newClasses.includes('relative')) {
        newClasses = 'relative ' + newClasses;
      }
      if (!newClasses.includes('overflow-hidden')) {
        newClasses += ' overflow-hidden';
      }

      const replacementSection = `<section className="${newClasses}">\n        <HeroBanner hideDots />`;
      
      // Also we need to wrap the contents `max-w-7xl mx-auto...` in a relative z-10 if it's the immediate child div
      // Find the next <div className="max-w-7xl or similar">
      
      content = content.slice(0, match.index) + replacementSection + content.slice(match.index + fullMatch.length);
      
      // Now the <div inside that section should get "relative z-10"
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
  } else {
    console.log(`No match found in: ${fullPath}`);
  }
});
