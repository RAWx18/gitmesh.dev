#!/usr/bin/env node

/**
 * Migration script to convert GitBook content to Nextra format
 * This script helps migrate existing .md files to .mdx format with proper structure
 */

const fs = require('fs');
const path = require('path');

// Directories to migrate
const sourceDirs = [
  './docs/getting-started',
  './docs/guides', 
  './docs/technical-docs'
];

const targetDir = './nextra/pages';

function convertGitBookToNextra(content) {
  // Convert GitBook-specific syntax to Nextra/MDX
  
  // Convert hints/callouts
  content = content.replace(/{% hint style="(.*?)" %}\n(.*?)\n{% endhint %}/gs, (match, style, text) => {
    const type = style === 'warning' ? 'warning' : style === 'danger' ? 'error' : 'info';
    return `import { Callout } from 'nextra/components'\n\n<Callout type="${type}">\n${text}\n</Callout>`;
  });
  
  // Convert YouTube embeds
  content = content.replace(/{% youtube %}(.*?){% endyoutube %}/g, (match, videoId) => {
    return `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameBorder="0" allowFullScreen></iframe>`;
  });
  
  // Convert GitBook links to relative links
  content = content.replace(/https:\/\/docs\.gitmesh\.dev\/docs\//g, '/');
  content = content.replace(/https:\/\/docs\.gitmesh\.ce\/docs\//g, '/');
  
  // Update image paths
  content = content.replace(/\.gitbook\/assets\//g, '/images/');
  
  return content;
}

function createMetaFile(dirPath, files) {
  const meta = {};
  
  files.forEach(file => {
    if (file.endsWith('.mdx') || file.endsWith('.md')) {
      const name = path.basename(file, path.extname(file));
      // Convert filename to title
      const title = name.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
      meta[name] = title;
    }
  });
  
  const metaPath = path.join(dirPath, '_meta.json');
  fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2));
  console.log(`Created ${metaPath}`);
}

function migrateDirectory(sourceDir, targetSubDir) {
  const fullSourceDir = path.resolve(sourceDir);
  const fullTargetDir = path.resolve(targetDir, targetSubDir);
  
  if (!fs.existsSync(fullSourceDir)) {
    console.log(`Source directory ${fullSourceDir} does not exist, skipping...`);
    return;
  }
  
  // Create target directory
  fs.mkdirSync(fullTargetDir, { recursive: true });
  
  const files = fs.readdirSync(fullSourceDir);
  const mdFiles = [];
  
  files.forEach(file => {
    const sourcePath = path.join(fullSourceDir, file);
    const stat = fs.statSync(sourcePath);
    
    if (stat.isFile() && (file.endsWith('.md') || file.endsWith('.mdx'))) {
      const content = fs.readFileSync(sourcePath, 'utf8');
      const convertedContent = convertGitBookToNextra(content);
      
      // Change extension to .mdx
      const targetFileName = file.replace(/\.md$/, '.mdx');
      const targetPath = path.join(fullTargetDir, targetFileName);
      
      fs.writeFileSync(targetPath, convertedContent);
      console.log(`Migrated ${sourcePath} -> ${targetPath}`);
      mdFiles.push(targetFileName);
    } else if (stat.isDirectory()) {
      // Recursively migrate subdirectories
      migrateDirectory(sourcePath, path.join(targetSubDir, file));
    }
  });
  
  // Create _meta.json for this directory
  if (mdFiles.length > 0) {
    createMetaFile(fullTargetDir, mdFiles);
  }
}

// Main migration
console.log('Starting GitBook to Nextra migration...');

sourceDirs.forEach(sourceDir => {
  const dirName = path.basename(sourceDir);
  console.log(`\nMigrating ${sourceDir}...`);
  migrateDirectory(sourceDir, dirName);
});

console.log('\nMigration complete!');
console.log('\nNext steps:');
console.log('1. cd docs/nextra');
console.log('2. npm install');
console.log('3. npm run dev');
console.log('4. Review and adjust the migrated content');
console.log('5. Update any broken links or images');