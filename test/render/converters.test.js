const { convertArchive, convertTag } = require('../../src/render/converters');

const context = {
  configuration: {
    websitePath: '/x/',
  },
};

describe('converters', () => {
  it('convertArchive', () => {
    expect(convertArchive(context, { year: 2020, month: 1 })).toEqual({
      name: 'January 2020',
      link: '/x/archive/2020-01/page-1.html',
    });
    expect(convertArchive(context, { year: 2020, month: 10 })).toEqual({
      name: 'October 2020',
      link: '/x/archive/2020-10/page-1.html',
    });
  });

  it('convertTag', () => {
    expect(convertTag(context, 'Hello world')).toEqual({
      name: 'Hello world',
      link: '/x/tags/Hello%20world/page-1.html',
    });
  });
});
