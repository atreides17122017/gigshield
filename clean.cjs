const fs = require('fs');
const path = require('path');

let changedCount = 0;

function cleanDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      cleanDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let text = fs.readFileSync(fullPath, 'utf8');
      if (text.includes('<<<<<<< HEAD')) {
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

cleanDir(path.join(__dirname, 'src'));
console.log(`Finished fixing. Total files cleaned: ${changedCount}`);
