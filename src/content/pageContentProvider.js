const fs = require('fs');
const path = require('path');
const loadPost = require('../posts/loadPost');
const { loadTextFile } = require('../files');
const encodePath = require('../path/encodePath');

module.exports = (context, pathComponents) => {
  if (pathComponents.length === 0) {
    return null;
  }

  const { paths } = context;
  const { pages } = paths;

  const pageFile = path.join(pages, ...pathComponents);
  if (fs.existsSync(pageFile)) {
    const postContent = loadPost(
      encodePath(context, pathComponents),
      loadTextFile(pageFile),
      false,
    );
    delete postContent.tags;

    return {
      type: 'content',
      content: {
        page: postContent,
      },
    };
  }

  return null;
};
