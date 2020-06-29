const path = require('path');
const getConfiguration = require('../../src/context/getConfiguration');

describe('getConfiguration', () => {
  it('valid', () => {
    expect(
      getConfiguration(path.join(__dirname, '__resources__', 'valid_website'))
    ).toEqual({
      theme: 'default',
      title: 'Title',
      subtitle: 'Subtitle',
      description: 'Description',
      keywords: ['test'],
      url: 'https://www.example.com',
      websitePath: '/',
      menu: [
        {
          name: 'About',
          link: '/about.html',
        },
      ],
      dateFormat: 'd MMMM yyyy',
      pageSize: 5,
    });
  });

  it('invalid', () => {
    expect(() =>
      getConfiguration(path.join(__dirname, '__resources__', 'invalid_website'))
    ).toThrow();
  });
});
