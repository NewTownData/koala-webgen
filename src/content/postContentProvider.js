const fs = require('fs');
const path = require('path');
const loadPost = require('../posts/loadPost');
const { loadTextFile } = require('../files');
const encodePath = require('../path/encodePath');
const { convertTag } = require('../render/converters');

module.exports = (context, pathComponents) => {
  if (pathComponents.length === 0) {
    return null;
  }

  const { paths } = context;
  const { posts } = paths;

  const postFile = path.join(posts, ...pathComponents);
  if (fs.existsSync(postFile)) {
    const postContent = loadPost(
      encodePath(context, pathComponents),
      loadTextFile(postFile),
      false,
    );

    return {
      type: 'content',
      content: {
        post: {
          ...postContent,
          tags: postContent.tags.map((tag) => convertTag(context, tag)),
        },
      },
    };
  }

  return null;
};
