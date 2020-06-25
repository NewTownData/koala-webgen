const path = require('path');
const renderPage = require('../src/renderPage');

const postsPath = path.join(__dirname, 'resources', 'posts');
const themePath = path.join(__dirname, 'resources', 'render_theme');

describe('renderPage', () => {
  it('post', () => {
    expect(
      renderPage(
        {
          type: 'html',
          post: { title: 'Post 1' },
          pageTitle: 'Post 1',
        },
        {
          title: 'Title',
          subtitle: 'Subtitle',
          menu: { About: '/about.html' },
        },
        { postsPath, themePath }
      )
    ).toBe('Title|Post 1 - Title|About|Post 1');
  });
});
