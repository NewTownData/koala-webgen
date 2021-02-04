const path = require('path');

const getConfiguration = require('../../src/context/getConfiguration');
const now = require('../../src/context/now');
const createContext = require('../../src/context/createContext');

jest.mock('../../src/context/getConfiguration');
jest.mock('../../src/context/now');

const TestDate = new Date(Date.UTC(2020, 11, 1, 14, 10, 20));

describe('getConfiguration', () => {
  beforeEach(() => {
    getConfiguration.mockClear();
    now.mockClear();
    now.mockImplementation(() => TestDate);
  });

  it('valid', () => {
    getConfiguration.mockImplementation(() => ({ theme: 'test' }));

    const website = path.join(__dirname, '__resources__', 'valid_website');

    const context = createContext(website);
    expect(context).toEqual({
      configuration: { theme: 'test' },
      paths: {
        pages: path.join(website, 'pages'),
        posts: path.join(website, 'posts'),
        static: path.join(website, 'static'),
        theme: path.join(website, 'themes', 'test'),
      },
      date: TestDate,
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
