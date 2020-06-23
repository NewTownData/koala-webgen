const path = require('path');
const getContentPaths = require('../src/getContentPaths');

const websitePath = path.join(__dirname, '..', 'website');

describe('getContentPaths', () => {
  it('works', () => {
    expect(getContentPaths(websitePath, { theme: 'abc' })).toEqual({
      pagesPath: path.join(websitePath, 'pages'),
      postsPath: path.join(websitePath, 'posts'),
      staticPath: path.join(websitePath, 'static'),
      themePath: path.join(websitePath, 'themes', 'abc'),
    });
  });
});
