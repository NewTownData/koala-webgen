const fs = require('fs');
const path = require('path');
const http = require('http');
const { TextDecoder } = require('util');
const server = require('../../../src/server');
const init = require('../../../src/init');
const now = require('../../../src/context/now');

jest.mock('../../../src/context/now');

const tempRoot = path.join(__dirname, '.temp_server');
const websitePath = path.join(tempRoot, 'website');

const port = 3082;
const urlPrefix = `http://localhost:${port}`;

const TestDate = new Date(Date.UTC(2020, 11, 1, 14, 10, 20));

function utf8(buffer) {
  const decoder = new TextDecoder('utf-8');
  return decoder.decode(buffer);
}

function fetch(url) {
  return new Promise((resolve, reject) => {
    const req = http.get(url);
    req.on('response', (res) => {
      const chunks = [];
      res.on('data', (chunk) => {
        chunks.push(chunk);
      });
      res.on('end', async () => {
        try {
          const data = Buffer.concat(chunks);
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data,
          });
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on('error', (err) => {
      reject(err);
    });
    req.on('timeout', () => {
      req.abort();
    });
  });
}

function modifyConfiguration(configPath) {
  const config = JSON.parse(fs.readFileSync(configPath, { encoding: 'utf-8' }));
  const updatedConfig = {
    ...config,
    websitePath: '/prefix/',
    menu: [{ name: 'About', link: '/prefix/about.html' }],
  };
  fs.writeFileSync(configPath, JSON.stringify(updatedConfig), {
    encoding: 'utf-8',
  });
}

describe('server', () => {
  let srv = null;

  beforeAll(async () => {
    fs.mkdirSync(tempRoot, { recursive: true });

    init(websitePath);
    modifyConfiguration(path.join(websitePath, 'configuration.json'));
    srv = await server(websitePath, port);

    now.mockClear();
    now.mockImplementation(() => TestDate);
  });

  afterAll((done) => {
    fs.rmSync(tempRoot, { recursive: true });
    srv.close(() => {
      done();
    });
  });

  it('redirect / to /prefix/', async () => {
    const response = await fetch(`${urlPrefix}/`);
    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toBe('/prefix/');
  });

  it('index', async () => {
    const response = await fetch(`${urlPrefix}/prefix/`);
    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toBe('text/html; charset=utf-8');

    expect(utf8(response.data)).toMatchSnapshot();
  });

  it('404', async () => {
    const response = await fetch(`${urlPrefix}/prefix/xyz.txt`);
    expect(response.statusCode).toBe(404);
  });

  it('page about.html', async () => {
    const response = await fetch(`${urlPrefix}/prefix/about.html`);
    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toBe('text/html; charset=utf-8');
    expect(utf8(response.data)).toMatchSnapshot();
  });

  it('post test/test.html', async () => {
    const response = await fetch(`${urlPrefix}/prefix/test/test.html`);
    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toBe('text/html; charset=utf-8');
    expect(utf8(response.data)).toMatchSnapshot();
  });

  it('tags tags/hello/page-1.html', async () => {
    const response = await fetch(`${urlPrefix}/prefix/tags/hello/page-1.html`);
    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toBe('text/html; charset=utf-8');
    expect(utf8(response.data)).toMatchSnapshot();
  });

  it('posts page-2.html', async () => {
    const response = await fetch(`${urlPrefix}/prefix/posts/page-2.html`);
    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toBe('text/html; charset=utf-8');
    expect(utf8(response.data)).toMatchSnapshot();
  });

  it('archive /archive/2019-03/page-1.html', async () => {
    const response = await fetch(
      `${urlPrefix}/prefix/archive/2019-03/page-1.html`,
    );
    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toBe('text/html; charset=utf-8');
    expect(utf8(response.data)).toMatchSnapshot();
  });

  it('500', async () => {
    const response = await fetch(`${urlPrefix}/prefix/%%%`);
    expect(response.statusCode).toBe(500);

    expect(utf8(response.data)).toEqual(
      'Internal Server Error\nError: URI malformed',
    );
  });

  it('feed.rss.xml', async () => {
    const response = await fetch(`${urlPrefix}/prefix/feed.rss.xml`);
    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toBe('text/xml');
    expect(utf8(response.data)).toMatchSnapshot();
  });
});
