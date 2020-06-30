const path = require('path');
const http = require('http');
const { TextDecoder } = require('util');
const { execute } = require('../../src/generator');
const startServer = require('../../src/server');

jest.mock('../../src/generator');

const websitePath = path.join(__dirname, '..', '..', 'website');
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

describe('server', () => {
  let server = null;
  beforeAll(async () => {
    server = await startServer(websitePath, port);
  });

  beforeEach(() => {
    execute.mockClear();
  });

  afterAll((done) => {
    server.close(() => {
      done();
    });
  });

  it('root', async () => {
    execute.mockImplementation(() => ({
      type: 'file',
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
      payload: 'hello world',
    }));

    const response = await fetch(`${urlPrefix}/`);
    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toBe('text/html; charset=utf-8');

    expect(utf8(response.data)).toEqual('hello world');

    expect(execute).toHaveBeenCalledWith(websitePath, '/');
  });

  it('path', async () => {
    execute.mockImplementation(() => ({
      type: 'file',
      headers: { 'Content-Type': 'text/plain' },
      payload: 'hello world',
    }));

    const response = await fetch(`${urlPrefix}/some/path`);
    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toBe('text/plain');

    expect(utf8(response.data)).toEqual('hello world');

    expect(execute).toHaveBeenCalledWith(websitePath, '/some/path');
  });

  it('404', async () => {
    execute.mockImplementation(() => ({ type: '404' }));

    const response = await fetch(`${urlPrefix}/xyz.txt`);
    expect(response.statusCode).toBe(404);

    expect(execute).toHaveBeenCalledWith(websitePath, '/xyz.txt');
  });

  it('unknown type', async () => {
    execute.mockImplementation(() => ({ type: 'xyz' }));

    const response = await fetch(`${urlPrefix}/`);
    expect(response.statusCode).toBe(500);
    expect(utf8(response.data)).toEqual(
      "Internal Server Error\nError: Unsupported response type 'xyz' for /"
    );

    expect(execute).toHaveBeenCalledWith(websitePath, '/');
  });

  it('500', async () => {
    execute.mockImplementation(() => {
      throw new Error('error');
    });

    const response = await fetch(`${urlPrefix}/`);
    expect(response.statusCode).toBe(500);

    expect(utf8(response.data)).toEqual('Internal Server Error\nError: error');
  });
});
