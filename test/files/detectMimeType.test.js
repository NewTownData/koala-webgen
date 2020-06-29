const detectMimeType = require('../../src/files/detectMimeType');

describe('detectMimeType', () => {
  it('works', () => {
    expect(detectMimeType('a/b/image.jpg')).toBe('image/jpeg');
    expect(detectMimeType('a/b/image.png')).toBe('image/png');
    expect(detectMimeType('favicon.ico')).toBe('image/x-icon');
    expect(detectMimeType('page.html')).toBe('text/html');
    expect(detectMimeType('test.css')).toBe('text/css');
    expect(detectMimeType('test.js')).toBe('text/javascript');
    expect(detectMimeType('file.bin')).toBe('application/octet-stream');
  });
});
