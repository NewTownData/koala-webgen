const path = require('path');
const loadPosts = require('../../src/posts/loadPosts');

const postsPath = path.join(__dirname, '__resources__', 'posts');

const context = {
  configuration: {
    websitePath: '/x/',
  },
  paths: {
    posts: postsPath,
  },
};

describe('loadPosts', () => {
  it('generic', () => {
    expect(loadPosts(context)).toEqual([
      {
        body: '<p>Paragraph A</p>',
        date: new Date('2020-07-10T10:45:00Z'),
        tags: ['tag3'],
        title: 'Second post',
        link: '/x/test_second_post.html',
      },
      {
        body: '<p>Paragraph 1</p>\n',
        date: new Date('2020-06-10T10:45:00Z'),
        tags: ['tag1', 'tag2'],
        title: 'Test title',
        link: '/x/test_post.html',
      },
    ]);
  });
});
