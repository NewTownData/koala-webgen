const fs = require('fs');
const path = require('path');
const getConfiguration = require('./getConfiguration');

function ensurePathExists(...paths) {
  const dir = path.join(...paths);
  if (!fs.existsSync(dir) || !fs.lstatSync(dir).isDirectory()) {
    throw new Error(`Directory ${dir} is not a valid path`);
  }
  return dir;
}

module.exports = (websiteRoot) => {
  const configuration = getConfiguration(websiteRoot);
  const { theme: selectedTheme } = configuration;

  return {
    configuration,
    paths: {
      pages: ensurePathExists(websiteRoot, 'pages'),
      posts: ensurePathExists(websiteRoot, 'posts'),
      static: ensurePathExists(websiteRoot, 'static'),
      theme: ensurePathExists(websiteRoot, 'themes', selectedTheme),
    },
  };
};
