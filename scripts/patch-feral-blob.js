const fs = require('fs');
const path = 'node_modules/feral-blob/dist/feral-blob.js';

if (!fs.existsSync(path)) {
  console.log('feral-blob not found');
  process.exit(0);
}

let content = fs.readFileSync(path, 'utf8');

// Replace problematic spring configurations that are paired with >2 keyframe arrays
const replacements = [
  {
    target: 'type: "spring", stiffness: 210, damping: 11, mass: 0.8',
    replace: 'ease: "easeInOut", duration: 0.6'
  },
  {
    target: 'type: "spring", stiffness: 220, damping: 9, mass: 0.7',
    replace: 'ease: "easeInOut", duration: 0.6'
  },
  {
    target: 'type: "spring", stiffness: 200, damping: 11, mass: 0.8',
    replace: 'ease: "easeInOut", duration: 0.6'
  }
];

let replacedCount = 0;
for (const { target, replace } of replacements) {
  if (content.includes(target)) {
    content = content.replaceAll(target, replace);
    replacedCount++;
  }
}

fs.writeFileSync(path, content, 'utf8');
console.log('Successfully applied ' + replacedCount + ' patch replacements to feral-blob');

