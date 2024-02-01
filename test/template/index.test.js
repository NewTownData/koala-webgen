const path = require('path');
const { executeTemplate } = require('../../src/template');

const theme = path.join(__dirname, '__resources__', 'test_theme');

const pageContext = {
  type: 'content',
  page: {
    title: 'Koala',
    subtitle: 'Static Website Generator',
    description: 'A simple static website generator',
    keywords: ['test'],
    url: 'https://www.example.com',
    websitePath: '/x/',
    pageTitle: 'Post - Koala',
    currentPath: '/x/post.html',
  },
  navigation: {
    menu: [
      {
        name: 'About',
        link: '/x/about.html',
      },
    ],
    archive: [{ name: '2020-01', link: '/archive/2020-01/page-1.html' }],
    tags: [{ name: 'Tag 1', link: '/tags/tag%201/page-1.html' }],
  },
  content: {
    post: {
      title: 'Post',
      date: new Date(Date.UTC(2020, 1, 20)),
      tags: [{ name: 'Tag 1', link: '/tags/tag%201/page-1.html' }],
      body: 'world',
      link: '/x/post.html',
    },
  },
};

describe('template', () => {
  it('executeTemplate default date', () => {
    const context = {
      configuration: {},
      paths: {
        theme,
      },
    };

    expect(executeTemplate(context, pageContext)).toEqual(
      '<b>Hello Post - Koala</b>\n<b>Bye world</b><i>2020-02-20</i>\n' +
        '<p>Post</p>\n\n\n<p>Not Index</p>',
    );
  });

  it('executeTemplate custom date', () => {
    const context = {
      configuration: {
        dateFormat: 'd MMMM yyyy',
      },
      paths: {
        theme,
      },
    };

    expect(executeTemplate(context, pageContext)).toEqual(
      '<b>Hello Post - Koala</b>\n<b>Bye world</b><i>20 February 2020</i>\n' +
        '<p>Post</p>\n\n\n<p>Not Index</p>',
    );
  });
});
