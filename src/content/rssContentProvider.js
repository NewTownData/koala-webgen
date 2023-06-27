const createFeed = require('../feed/createFeed');
const loadPosts = require('../posts/loadPosts');

module.exports = (context, pathComponents) => {
  if (pathComponents.length !== 1 || pathComponents[0] !== 'feed.rss.xml') {
    return null;
  }

  const { configuration, date } = context;
  const { feedSize } = configuration;

  const feed = createFeed(configuration, date);

  const posts = loadPosts(context);
  for (let i = 0; i < Math.min(posts.length, feedSize); i += 1) {
    feed.addItem(posts[i]);
  }

  return {
    type: 'file',
    headers: {
      'Content-Type': 'text/xml',
    },
    payload: feed.build(),
  };
};
