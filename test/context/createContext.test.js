const path = require('path');

const getConfiguration = require('../../src/context/getConfiguration');
const createContext = require('../../src/context/createContext');

jest.mock('../../src/context/getConfiguration');

describe('getConfiguration', () => {
  beforeEach(() => {
    getConfiguration.mockClear();
  });

  it('valid', () => {
    getConfiguration.mockImplementation(() => ({ theme: 'test' }));

    const website = path.join(__dirname, '__resources__', 'valid_website');

    expect(createContext(website)).toEqual({
      configuration: { theme: 'test' },
      paths: {
        pages: path.join(website, 'pages'),
        posts: path.join(website, 'posts'),
        static: path.join(website, 'static'),
        theme: path.join(website, 'themes', 'test'),
      },
    });
  });

  it('invalid - no dir', () => {
    getConfiguration.mockImplementation(() => ({ theme: 'test' }));

    const website = path.join(__dirname, '__resources__', 'invalid_website');

    expect(() => createContext(website)).toThrow();
  });

  it('invalid - text file', () => {
    getConfiguration.mockImplementation(() => ({ theme: 'invalid' }));

    const website = path.join(__dirname, '__resources__', 'valid_website');

    expect(() => createContext(website)).toThrow();
  });
});
