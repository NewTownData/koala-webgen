const path = require('path');
const loadTextFile = require('../src/loadTextFile');

describe('loadTextFile', () => {
  it('works', () => {
    const textFile = path.join(__dirname, 'resources', 'utf8_file.txt');
    expect(loadTextFile(textFile)).toBe('Řeřicha,Malmö');
  });
});
