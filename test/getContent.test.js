const path = require('path');
const getContent = require('../src/getContent');
const getContentPaths = require('../src/getContentPaths');

const websitePath = path.join(__dirname, '..', 'website');
const contentPaths = getContentPaths(websitePath, { theme: 'default' });

describe('getContent', () => {
  it('root', () => {
    expect(getContent('/', contentPaths)).toMatchObject({
      type: 'html',
      posts: expect.arrayContaining([
        expect.objectContaining({ title: 'Hello World' }),
        expect.objectContaining({ title: 'Test' }),
      ]),
      pathName: '/',
    });
  });

  it('page', () => {
    expect(getContent('/about.html', contentPaths)).toMatchObject({
      type: 'html',
      page: expect.objectContaining({ title: 'About' }),
      pathName: '/about.html',
    });
  });

  it('post', () => {
    expect(getContent('/test.html', contentPaths)).toMatchObject({
      type: 'html',
      posts: expect.arrayContaining([
        expect.objectContaining({ title: 'Test' }),
      ]),
      pathName: '/test.html',
    });
  });

  it('favicon.ico', () => {
    expect(getContent('/favicon.ico', contentPaths)).toMatchObject({
      type: 'file',
      content: expect.any(Buffer),
      mimeType: 'image/x-icon',
    });
  });

  it('theme style.css', () => {
    expect(getContent('/style.css', contentPaths)).toMatchObject({
      type: 'file',
      content: expect.any(Buffer),
      mimeType: 'text/css',
    });
  });

  it('404', () => {
    expect(getContent('/xyz.txt', contentPaths)).toMatchObject({
      type: '404',
      pathName: '/xyz.txt',
    });
  });
});
