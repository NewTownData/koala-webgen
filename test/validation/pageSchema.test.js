const pageSchema = require('../../src/validation/pageSchema');

const exampleContentPage = {
  title: 'Page',
  description: 'Text',
  date: new Date(),
  body: '<p>Text</p>',
  link: 'page.html',
};

const exampleContentPost = {
  title: 'Post',
  description: 'Text',
  date: new Date(),
  tags: [
    { name: 'x', link: '/tags/x/page-1.html' },
    { name: 'y', link: '/tags/y/page-1.html' },
  ],
  body: '<p>Text</p>',
  link: 'post.html',
};

const exampleContentPosts = {
  posts: {
    title: 'Posts',
    items: [
      {
        title: 'Post',
        description: 'Text',
        date: new Date(),
        tags: ['x', 'y'],
        body: '<p>Text</p>',
        link: 'post.html',
      },
    ],
    pagination: { pageNumber: 2 },
  },
};

const examplePagePosts = {
  type: 'content',
  page: {
    title: 'Koala',
    subtitle: 'Static Website Generator',
    description: 'A simple static website generator',
    keywords: ['test'],
    url: 'https://www.example.com',
    websitePath: '/',
    pageTitle: 'Koala',
    currentPath: '/',
  },
  navigation: {
    menu: [
      {
        name: 'About',
        link: '/about.html',
      },
    ],
    archive: [{ name: '2020-01', link: '/archive/2020-01/page-1.html' }],
    tags: [{ name: 'Tag 1', link: '/tags/tag%201/page-1.html' }],
  },
  content: {
    ...exampleContentPosts,
  },
};

const examplePagePost = {
  ...examplePagePosts,
  content: {
    post: { ...exampleContentPost },
  },
};

const examplePagePage = {
  ...examplePagePosts,
  content: {
    page: { ...exampleContentPage },
  },
};

describe('pageSchema', () => {
  it('validates posts', () => {
    expect(pageSchema.validate(examplePagePosts).error).toBeUndefined();
  });

  it('validates post', () => {
    expect(pageSchema.validate(examplePagePost).error).toBeUndefined();
  });

  it('validates pages', () => {
    expect(pageSchema.validate(examplePagePage).error).toBeUndefined();
  });

  it('fails', () => {
    Object.keys(examplePagePosts).forEach((key) => {
      if (key === 'content') {
        return;
      }
      const context = { ...examplePagePosts };
      context[key] = undefined;
      expect(pageSchema.validate(context).error).not.toBeUndefined();
    });
  });

  it('empty fails', () => {
    expect(pageSchema.validate().error).not.toBeUndefined();
  });
});
