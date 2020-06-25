const path = require('path');
const loadMenu = require('./loadMenu');
const { createTemplate } = require('./templates');
const { loadTags, loadDates } = require('./loadPostsFunctions');
const { convertTag, convertArchive } = require('./converters');

function renderPage(content, configuration, contentPaths) {
  const { postsPath, themePath } = contentPaths;
  const { title, subtitle } = configuration;

  const menu = loadMenu(configuration);

  const template = createTemplate(path.join(themePath, 'index.html'));

  const tags = loadTags(postsPath).map(convertTag);
  const archives = loadDates(postsPath).map(convertArchive);

  let pageTitle = `${title} - ${subtitle}`;
  if (content.pageTitle) {
    pageTitle = `${content.pageTitle} - ${title}`;
  }

  return template({
    ...configuration,
    menu,
    content,
    pageTitle,
    navigation: {
      tags,
      archives,
    },
  });
}

module.exports = renderPage;
