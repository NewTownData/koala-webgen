/**
 * This file must be placed in `integration` folder as the test cannot be run from watcher.
 * Creation of files cases watcher to crash jest.
 */
const path = require('path');
const fs = require('fs');
const build = require('../../src/build');

const tempRoot = path.join(__dirname, '.temp');
const destination = path.join(tempRoot, 'dist');

const websiteRoot = path.join(__dirname, '..', '..', 'website');

describe('build', () => {
  beforeEach(() => {
    fs.mkdirSync(tempRoot, { recursive: true });
  });

  afterEach(() => {
    fs.rmdirSync(destination, {
      recursive: true,
    });
    fs.rmdirSync(tempRoot, { recursive: true });
  });

  it('works', () => {
    expect(fs.existsSync(destination)).toBe(false);

    build(websiteRoot, destination);

    expect(fs.existsSync(destination)).toBe(true);
    expect(fs.readdirSync(destination)).toEqual([
      'about.html',
      'favicon.ico',
      'hello-world.html',
      'images',
      'index.html',
      'style.css',
      'test.html',
    ]);
    expect(fs.readdirSync(path.join(destination, 'images'))).toEqual([
      'logo-128.png',
      'logo-512.png',
    ]);
  });
});
