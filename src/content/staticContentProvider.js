const fs = require('fs');
const path = require('path');
const detectMimeType = require('../files/detectMimeType');

module.exports = (context, pathComponents) => {
  if (pathComponents.length === 0) {
    return null;
  }

  const { paths } = context;
  const { static: staticPath } = paths;

  const staticFile = path.join(staticPath, ...pathComponents);
  if (fs.existsSync(staticFile)) {
    return {
      type: 'file',
      headers: {
        'Content-Type': detectMimeType(
          pathComponents[pathComponents.length - 1]
        ),
      },
      payload: fs.readFileSync(staticFile),
    };
  }

  return null;
};
