/**
 * This file must be placed in `__integration__` folder as the test cannot be run from watcher.
 * Creation of files cases watcher to crash jest.
 */
const path = require('path');
const fs = require('fs');
const init = require('../../../src/init');

const tempRoot = path.join(__dirname, '.temp_init');
const websiteRoot = path.join(tempRoot, 'website');

describe('init', () => {
  beforeEach(() => {
    fs.mkdirSync(tempRoot, { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(websiteRoot, {
      recursive: true,
    });
    fs.rmSync(tempRoot, { recursive: true });
  });

  it('works', () => {
    expect(fs.existsSync(websiteRoot)).toBe(false);

    init(websiteRoot);

    expect(fs.existsSync(websiteRoot)).toBe(true);
    expect(fs.readdirSync(websiteRoot)).toEqual([
      'configuration.json',
      'pages',
      'posts',
      'static',
      'themes',
    ]);
  });
});
