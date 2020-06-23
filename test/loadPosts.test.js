const path = require('path');
const loadPosts = require('../src/loadPosts');

const postsPath = path.join(__dirname, 'resources');

describe('loadPosts', () => {
  it('works', () => {
    expect(loadPosts(postsPath)).toEqual([
      {
        content: '<p>Paragraph 1</p>\n',
        date: new Date('2020-06-10T10:45:00'),
        preview: true,
        tags: ['tag1', 'tag2'],
        title: 'Test title',
        url: '/test_post.html',
      },
    ]);
  });
});
