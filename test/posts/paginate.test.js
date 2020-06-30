const paginate = require('../../src/posts/paginate');

const context = {
  configuration: {
    pageSize: 3,
    websitePath: '/x/',
  },
};

const urlFactory = (pageNumber) => `page-${pageNumber}.html`;

describe('paginate', () => {
  it('zero results', () => {
    expect(paginate(context, [], urlFactory)).toEqual([]);
  });

  it('one result', () => {
    expect(paginate(context, ['a'], urlFactory)).toEqual([
      { items: ['a'], link: '/x/page-1.html' },
    ]);
  });

  it('one page of results', () => {
    expect(paginate(context, ['a', 'b', 'c'], urlFactory)).toEqual([
      { items: ['a', 'b', 'c'], link: '/x/page-1.html' },
    ]);
  });

  it('two pages of results', () => {
    expect(paginate(context, ['a', 'b', 'c', 'd'], urlFactory)).toEqual([
      { items: ['a', 'b', 'c'], link: '/x/page-1.html' },
      { items: ['d'], link: '/x/page-2.html' },
    ]);
  });
});
