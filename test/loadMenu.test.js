const loadMenu = require('../src/loadMenu');

describe('loadMenu', () => {
  it('works', () => {
    expect(
      loadMenu({ menu: { About: '/about.html', Test: '/a/test.html' } })
    ).toEqual([
      { title: 'About', url: '/about.html' },
      { title: 'Test', url: '/a/test.html' },
    ]);
  });
});
