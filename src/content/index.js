const prefixContentProvider = require('./prefixContentProvider');
const pageContentProvider = require('./pageContentProvider');
const postContentProvider = require('./postContentProvider');
const staticContentProvider = require('./staticContentProvider');
const themeContentProvider = require('./themeContentProvider');
const rssContentProvider = require('./rssContentProvider');

const contentProviders = [
  prefixContentProvider,
  pageContentProvider,
  postContentProvider,
  staticContentProvider,
  themeContentProvider,
  rssContentProvider,
];

module.exports = (context, pathComponents) => {
  for (let i = 0; i < contentProviders.length; i += 1) {
    const content = contentProviders[i](context, pathComponents);
    if (content) {
      return content;
    }
  }
  return null;
};
