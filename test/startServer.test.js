const path = require('path');
const http = require('http');
const { TextDecoder } = require('util');
const startServer = require('../src/startServer');

const websitePath = path.join(__dirname, '..', 'website');
const port = 3081;
const urlPrefix = `http://localhost:${port}`;

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

describe('startServer', () => {
  let server = null;
  beforeAll(async () => {
    server = await startServer(websitePath, port);
  });

  afterAll((done) => {
    server.close(() => {
      console.log('Closed');
      done();
    });
  });

  it('root', async () => {
    const response = await fetch(`${urlPrefix}/`);
    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toBe('text/html; charset=utf-8');

    expect(utf8(response.data)).toMatchSnapshot();
  });

  it('page about', async () => {
    const response = await fetch(`${urlPrefix}/about.html`);
    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toBe('text/html; charset=utf-8');

    expect(utf8(response.data)).toMatchSnapshot();
  });

  it('post hello-world', async () => {
    const response = await fetch(`${urlPrefix}/hello-world.html`);
    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toBe('text/html; charset=utf-8');

    expect(utf8(response.data)).toMatchSnapshot();
  });

  it('favicon.ico', async () => {
    const response = await fetch(`${urlPrefix}/favicon.ico`);
    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toBe('image/x-icon');
    expect(response.data.length).toBe(4286);
  });

  it('images/logo-128.png', async () => {
    const response = await fetch(`${urlPrefix}/images/logo-128.png`);
    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toBe('image/png');
    expect(response.data.length).toBe(5109);
  });

  it('style.css', async () => {
    const response = await fetch(`${urlPrefix}/style.css`);
    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toBe('text/css');
    expect(utf8(response.data)).toContain('html {');
  });

  it('404', async () => {
    const response = await fetch(`${urlPrefix}/xyz.txt`);
    expect(response.statusCode).toBe(404);
  });
});
