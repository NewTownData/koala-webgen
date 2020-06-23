const path = require('path');
const getConfiguration = require('../src/getConfiguration');

const websitePath = path.join(__dirname, '..', 'website');

describe('getConfiguration', () => {
  it('works', () => {
    expect(getConfiguration(websitePath)).toEqual({
      description: 'A simple static website generator',
      menu: { About: '/about.html' },
      subtitle: 'Static Website Generator',
      theme: 'default',
      title: 'Koala',
      url: 'https://www.koalaspace.com/',
    });
  });
});
