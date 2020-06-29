const { executeTemplate } = require('../template');
const { loadTags, loadDates } = require('../posts/loadPostsFunctions');
const { convertTag, convertArchive } = require('./converters');

function renderHtml(context, content, requestPath) {
  const { configuration } = context;
  const { title, subtitle, websitePath } = configuration;

  const tags = loadTags(context).map((tag) => convertTag(context, tag));
  const archive = loadDates(context).map((date) =>
    convertArchive(context, date)
  );

  let pageTitle = `${title} - ${subtitle}`;
  if (content.post) {
    pageTitle = `${content.post.title} - ${title}`;
  } else if (content.page) {
    pageTitle = `${content.page.title} - ${title}`;
  } else if (content.posts && requestPath !== websitePath) {
    if (content.posts.pagination.pageNumber > 1) {
      pageTitle = `${content.posts.title} - Page ${content.posts.pagination.pageNumber} - ${title}`;
    } else {
      pageTitle = `${content.posts.title} - ${title}`;
    }
  }

  const pageContext = {
    type: 'html',
    page: {
      title: configuration.title,
      subtitle: configuration.subtitle,
      description: configuration.description,
      keywords: configuration.keywords,
      url: configuration.url,
      websitePath: configuration.websitePath,
      currentPath: requestPath,
      pageTitle,
    },
    content,
    navigation: {
      menu: configuration.menu,
      tags,
      archive,
    },
  };

  return executeTemplate(context, pageContext);
}

module.exports = (context, content, requestPath) => {
  const { type, content: subContent } = content;
  if (type === 'content') {
    const payload = renderHtml(context, subContent, requestPath);
    return {
      type: 'file',
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
      payload,
    };
  }

  return content;
};
