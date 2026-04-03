const fs = require('fs');
const path = require('path');

let changedCount = 0;

function cleanDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
        if (file !== 'node_modules' && file !== '.git') {
            cleanDir(fullPath);
        }
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.json')) {
      let text = fs.readFileSync(fullPath, 'utf8');
      if (text.includes('<<<<<<< HEAD') && !fullPath.includes('package-lock.json')) {
        const regex = /<<<<<<< HEAD\r?\n([\s\S]*?)=======\r?\n[\s\S]*?>>>>>>> [a-f0-9A-Za-z]+\r?\n/g;
        const initialLength = text.length;
        text = text.replace(regex, '$1');
        if (text.length !== initialLength) {
          fs.writeFileSync(fullPath, text, 'utf8');
          console.log(`Cleaned: ${fullPath}`);
          changedCount++;
        }
      }
    }
  }
}

cleanDir(__dirname);
console.log(`Finished fixing. Total files cleaned: ${changedCount}`);
