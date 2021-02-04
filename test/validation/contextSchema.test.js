const path = require('path');
const contextSchema = require('../../src/validation/contextSchema');

const exampleConfiguration = {
  theme: 'default',
  title: 'Koala',
  subtitle: 'Static Website Generator',
  description: 'A simple static website generator',
  keywords: ['test'],
  url: 'https://www.koalaspace.com',
  websitePath: '/',
  menu: [
    {
      name: 'About',
      link: '/about.html',
    },
  ],
  dateFormat: 'd MMMM yyyy',
  pageSize: 5,
  feedSize: 10,
};

const exampleContext = {
  configuration: exampleConfiguration,
  paths: {
    static: path.join('x', 'static'),
    posts: path.join('x', 'static'),
    pages: path.join('x', 'static'),
    theme: path.join('x', 'static'),
  },
};

describe('contextSchema', () => {
  it('validates', () => {
    expect(contextSchema.validate(exampleContext).error).toBeUndefined();
  });

  it('fails', () => {
    Object.keys(exampleContext).forEach((key) => {
      const context = { ...exampleContext };
      context[key] = undefined;
      expect(contextSchema.validate(context).error).not.toBeUndefined();
    });
  });

  it('empty fails', () => {
    expect(contextSchema.validate().error).not.toBeUndefined();
  });
});
