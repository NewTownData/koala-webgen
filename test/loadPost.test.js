const path = require('path');
const loadTextFile = require('../src/loadTextFile');
const loadPost = require('../src/loadPost');

const testFile = loadTextFile(
  path.join(__dirname, 'resources', 'test_post.html')
);

describe('loadPost', () => {
  it('trimmed', () => {
    expect(loadPost('/test-post.html', testFile, true)).toStrictEqual({
      content: '<p>Paragraph 1</p>\n',
      date: new Date('2020-06-10T09:45:00.000Z'),
      preview: true,
      tags: ['tag1', 'tag2'],
      title: 'Test title',
      url: '/test-post.html',
    });
  });

  it('full', () => {
    expect(loadPost('/test-post.html', testFile, false)).toStrictEqual({
      content: '<p>Paragraph 1</p>\n<p>Paragraph 2</p>',
      date: new Date('2020-06-10T09:45:00.000Z'),
      preview: false,
      tags: ['tag1', 'tag2'],
      title: 'Test title',
      url: '/test-post.html',
    });
  });
});
