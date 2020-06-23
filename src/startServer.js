const http = require('http');
const { initTemplates } = require('./templates');
const getContent = require('./getContent');
const getConfiguration = require('./getConfiguration');
const getContentPaths = require('./getContentPaths');
const renderPage = require('./renderPage');

function startServer(websiteRoot, port) {
  const configuration = getConfiguration(websiteRoot);
  const contentPaths = getContentPaths(websiteRoot, configuration);

  const { themePath } = contentPaths;

  initTemplates(configuration, themePath);

  const server = http.createServer((request, response) => {
    let pathName = '/';

    try {
      const url = new URL(`http://localhost:${port}${request.url}`);
      pathName = decodeURIComponent(url.pathname);
    } catch (e) {
      console.warn('Invalid URL', e);
    }

    const content = getContent(pathName, contentPaths);
    switch (content.type) {
      case 'html':
        console.log(`HTML for ${pathName}`);
        response.writeHead(200, {
          'Content-Type': 'text/html; charset=utf-8',
        });
        response.end(renderPage(content, configuration, contentPaths));
        break;
      case 'file':
        console.log(`Content Type: ${content.mimeType}`);
        response.writeHead(200, {
          'Content-Type': content.mimeType,
          'Content-Length': content.content.length,
        });
        response.end(content.content);
        break;
      default:
        response.writeHead(404, 'Not Found', {
          'Content-Type': 'text/plain; charset=utf-8',
        });
        response.end('Not found');
        break;
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
