const fs = require('fs');

function loadTextFile(filePath) {
  try {
    return fs.readFileSync(filePath, { encoding: 'utf8' });
  } catch (e) {
    throw new Error(`Cannot read file ${filePath}: ${e.message}`);
  }
}

module.exports = { loadTextFile };
