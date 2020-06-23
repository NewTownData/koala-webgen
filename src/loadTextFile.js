const fs = require('fs');

function loadTextFile(filePath) {
  return fs.readFileSync(filePath, { encoding: 'utf8' });
}

module.exports = loadTextFile;
