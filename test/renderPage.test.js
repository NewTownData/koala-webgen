const path = require('path');
const renderPage = require('../src/renderPage');

const themePath = path.join(__dirname, 'resources', 'render_theme');

describe('renderPage', () => {
  it('root', () => {
    expect(
      renderPage(
        {
          type: 'html',
          posts: [{ title: 'Post 1' }, { title: 'Post 2' }],
        },
        {
          title: 'Title',
          subtitle: 'Subtitle',
          menu: { About: '/about.html' },
        },
        { themePath }
      )
    ).toBe('Title|Title - Subtitle|About|Post 1_Post 2_|');
  });

  it('post', () => {
    expect(
      renderPage(
        {
          type: 'html',
          posts: [{ title: 'Post 1' }],
        },
        {
          title: 'Title',
          subtitle: 'Subtitle',
          menu: { About: '/about.html' },
        },
        { themePath }
      )
    ).toBe('Title|Post 1 - Title|About|Post 1_|');
  });

  it('page', () => {
    expect(
      renderPage(
        {
          type: 'html',
          page: { title: 'Page 1' },
        },
        {
          title: 'Title',
          subtitle: 'Subtitle',
          menu: { About: '/about.html' },
        },
        { themePath }
      )
    ).toBe('Title|Page 1 - Title|About||Page 1');
  });
});
