/**
 * This file must be placed in `__integration__` folder as the test cannot be run from watcher.
 * Creation of files cases watcher to crash jest.
 */
const path = require('path');
const fs = require('fs');
const build = require('../../../src/build');

const tempRoot = path.join(__dirname, '.temp_build');
const destination = path.join(tempRoot, 'dist');

const websiteRoot = path.join(__dirname, '..', '..', '..', 'website');

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
      'archive',
      'favicon.ico',
      'hello-world.html',
      'images',
      'index.html',
      'post1.html',
      'post2.html',
      'post3.html',
      'post4.html',
      'post5.html',
      'posts',
      'style.css',
      'tags',
      'test',
    ]);
    expect(fs.readdirSync(path.join(destination, 'images'))).toEqual([
      'logo-128.png',
      'logo-512.png',
    ]);
    expect(fs.readdirSync(path.join(destination, 'archive'))).toEqual([
      '2019-01',
      '2019-03',
      '2020-06',
    ]);
    expect(
      fs.readdirSync(path.join(destination, 'archive', '2019-03'))
    ).toEqual(['page-1.html']);
    expect(fs.readdirSync(path.join(destination, 'tags'))).toEqual([
      'hello',
      'intro',
      'number',
      'test',
    ]);
    expect(fs.readdirSync(path.join(destination, 'tags', 'test'))).toEqual([
      'page-1.html',
    ]);
    expect(fs.readdirSync(path.join(destination, 'posts'))).toEqual([
      'page-2.html',
    ]);
    expect(fs.readdirSync(path.join(destination, 'test'))).toEqual([
      'test.html',
    ]);
  });
});
