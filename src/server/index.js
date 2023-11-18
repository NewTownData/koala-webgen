const http = require('http');
const { execute } = require('../generator');
const responseSchema = require('../validation/responseSchema');

function getRequestUrl(request) {
  const { url } = request;
  try {
    const requestUrl = new URL(`http://localhost${url}`);
    return requestUrl.pathname;
  } catch (e) {
    throw new Error(`Failed to parse URL ${url}`);
  }
}

function startServer(websiteRoot, port) {
  const server = http.createServer((request, response) => {
    try {
      const requestPath = getRequestUrl(request);
      const responseObject = execute(websiteRoot, requestPath);

      const responseValidationResult = responseSchema.validate(responseObject);
      if (responseValidationResult.error) {
        throw new Error(
          `Failed to validate response ${responseValidationResult.error}`,
        );
      }

      const { type, headers, payload } = responseObject;
      switch (type) {
        case 'file':
          console.log(`File response for ${requestPath}`);
          response.writeHead(200, headers);
          response.end(payload);
          break;
        case '302':
          response.writeHead(302, 'Found', headers);
          response.end();
          break;
        case '404':
          response.writeHead(404, 'Not Found', {
            'Content-Type': 'text/plain; charset=utf-8',
          });
          response.end(`Not found\nPath: ${requestPath}`);
          break;
        default:
          console.log(`Unsupported response type '${type}' for ${requestPath}`);
          response.writeHead(500, 'Internal Server Error', {
            'Content-Type': 'text/plain; charset=utf-8',
          });
          response.end(
            `Internal Server Error\nError: Unsupported response type '${type}' for ${requestPath}`,
          );
          break;
      }
    } catch (e) {
      console.error('Failed to produce server response', e);
      response.writeHead(500, 'Internal Server Error', {
        'Content-Type': 'text/plain; charset=utf-8',
      });
      response.end(`Internal Server Error\nError: ${e.message}`);
    }
  });

  return new Promise((resolve, reject) => {
    try {
      server.listen(port, () => {
        console.log(`Running at http://localhost:${port}`);
        resolve(server);
      });
    } catch (e) {
      console.error(`Failed to start server on port ${port}`, e);
      reject(e);
    }
  });
}

module.exports = startServer;
