const path = require('path');
const { loadTextFile } = require('../../src/files');
const loadPost = require('../../src/posts/loadPost');

const testFile = loadTextFile(
  path.join(__dirname, '__resources__', 'posts', 'test_post.html'),
);

describe('loadPost', () => {
  it('trimmed', () => {
    expect(loadPost('/test-post.html', testFile, true)).toStrictEqual({
      body: '<p>Paragraph 1</p>\n',
      date: new Date('2020-06-10T10:45:00Z'),
      tags: ['tag1', 'tag2'],
      title: 'Test title',
      link: '/test-post.html',
    });
  });

  it('full', () => {
    expect(loadPost('/test-post.html', testFile, false)).toStrictEqual({
      body: '<p>Paragraph 1</p>\n<p>Paragraph 2</p>',
      date: new Date('2020-06-10T10:45:00Z'),
      tags: ['tag1', 'tag2'],
      title: 'Test title',
      link: '/test-post.html',
    });
  });
});
