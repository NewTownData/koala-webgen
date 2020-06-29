const createContext = require('../context/createContext');
const decodePath = require('../path/decodePath');
const provideContent = require('../content');
const renderContent = require('../render');

function executeWithContext(context, requestPath) {
  const { configuration } = context;
  const { websitePath } = configuration;

  if (requestPath.indexOf(websitePath) !== 0) {
    console.warn(
      `Request ${requestPath} is outside of website path ${websitePath}`
    );
    return {
      type: '302',
      headers: { Location: websitePath },
    };
  }

  const pathComponents = decodePath(requestPath.substring(websitePath.length));
  const content = provideContent(context, pathComponents);
  if (!content) {
    return {
      type: '404',
    };
  }

  return renderContent(context, content, requestPath);
}

function execute(websiteRoot, requestPath) {
  const context = createContext(websiteRoot);
  return executeWithContext(context, requestPath);
}

module.exports = { execute, executeWithContext };
