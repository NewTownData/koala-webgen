const { convertArchive, convertTag } = require('../src/converters');

describe('converters', () => {
  it('convertArchive', () => {
    expect(convertArchive({ year: 2020, month: 1 })).toEqual({
      title: 'January 2020',
      url: '/archive/2020-01/page-1.html',
    });
    expect(convertArchive({ year: 2020, month: 10 })).toEqual({
      title: 'October 2020',
      url: '/archive/2020-10/page-1.html',
    });
  });

  it('convertTag', () => {
    expect(convertTag('Hello world')).toEqual({
      title: 'Hello world',
      url: '/tags/Hello%20world/page-1.html',
    });
  });
});
