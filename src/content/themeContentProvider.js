const fs = require('fs');
const path = require('path');
const detectMimeType = require('../files/detectMimeType');

module.exports = (context, pathComponents) => {
  if (pathComponents.length === 0) {
    return null;
  }

  const { paths } = context;
  const { theme } = paths;

  const themeFile = path.join(theme, ...pathComponents);
  if (fs.existsSync(themeFile)) {
    return {
      type: 'file',
      headers: {
        'Content-Type': detectMimeType(
          pathComponents[pathComponents.length - 1],
        ),
      },
      payload: fs.readFileSync(themeFile),
    };
  }

  return null;
};
