const path = require('path');
const { loadTextFile } = require('../../src/files');

describe('loadTextFile', () => {
  it('works', () => {
    const textFile = path.join(__dirname, '__resources__', 'utf8_file.txt');
    expect(loadTextFile(textFile)).toBe('Řeřicha,Malmö');
  });
});
