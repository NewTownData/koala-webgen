const path = require('path');

function getContentPaths(websiteRoot, configuration) {
  const { theme: selectedTheme } = configuration;

  return {
    pagesPath: path.resolve(websiteRoot, 'pages'),
    postsPath: path.resolve(websiteRoot, 'posts'),
    staticPath: path.resolve(websiteRoot, 'static'),
    themePath: path.resolve(websiteRoot, 'themes', selectedTheme),
  };
}

module.exports = getContentPaths;
