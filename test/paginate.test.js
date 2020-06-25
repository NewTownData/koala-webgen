const paginate = require('../src/paginate');

describe('paginate', () => {
  it('zero results', () => {
    expect(paginate([], 3)).toEqual([]);
  });

  it('one result', () => {
    expect(paginate(['a'], 3)).toEqual([['a']]);
  });

  it('one page of results', () => {
    expect(paginate(['a', 'b', 'c'], 3)).toEqual([['a', 'b', 'c']]);
  });

  it('two pages of results', () => {
    expect(paginate(['a', 'b', 'c', 'd'], 3)).toEqual([['a', 'b', 'c'], ['d']]);
  });
});
