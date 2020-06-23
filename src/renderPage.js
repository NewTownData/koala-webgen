const path = require('path');
const loadMenu = require('./loadMenu');
const { createTemplate } = require('./templates');

function renderPage(content, configuration, contentPaths) {
  const { themePath } = contentPaths;
  const { title, subtitle } = configuration;

  const menu = loadMenu(configuration);

  const template = createTemplate(path.join(themePath, 'index.html'));

  let pageTitle = `${title} - ${subtitle}`;
  if (content.page) {
    pageTitle = `${content.page.title} - ${title}`;
  } else if (content.posts && content.posts.length === 1) {
    pageTitle = `${content.posts[0].title} - ${title}`;
  }

  return template({
    ...configuration,
    menu,
    ...content,
    pageTitle,
  });
}

module.exports = renderPage;
