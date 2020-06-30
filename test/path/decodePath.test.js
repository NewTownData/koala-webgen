const decodePath = require('../../src/path/decodePath');

describe('decodePath', () => {
  it('with /', () => {
    expect(decodePath('/test/a/b%20c')).toEqual(['test', 'a', 'b c']);
  });

  it('without /', () => {
    expect(decodePath('test/a/b%20c')).toEqual(['test', 'a', 'b c']);
  });

  it('no argument', () => {
    expect(decodePath()).toEqual([]);
  });
});
