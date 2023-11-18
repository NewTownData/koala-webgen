const { format } = require('date-fns');
const loadPosts = require('./loadPosts');
const paginate = require('./paginate');
const {
  allPostsUrlFactory,
  postsByDateUrlFactory,
  postsByTagUrlFactory,
} = require('../path/urlFactory');

function loadAllPosts(context) {
  const posts = loadPosts(context);
  return {
    title: 'Posts',
    items: paginate(context, posts, allPostsUrlFactory()),
  };
}

function loadPostsByDate(context, year, month) {
  const posts = loadPosts(context).filter(
    (post) =>
      post.date.getUTCFullYear() === year &&
      post.date.getUTCMonth() + 1 === month,
  );
  return {
    title: `Archive ${format(
      new Date(Date.UTC(year, month - 1, 1)),
      'MMMM yyyy',
    )}`,
    items: paginate(context, posts, postsByDateUrlFactory({ year, month })),
  };
}

function loadPostsByTag(context, tag) {
  const posts = loadPosts(context).filter((post) => post.tags.includes(tag));
  return {
    title: `Tag ${tag}`,
    items: paginate(context, posts, postsByTagUrlFactory(tag)),
  };
}

function loadTags(context) {
  const tags = loadPosts(context)
    .map((post) => post.tags)
    .reduce((previous, current) => {
      previous.push(...current);
      return previous;
    }, []);

  // unique tags
  return [...new Set(tags)].sort();
}

function loadDates(context) {
  const takenDates = new Set();

  return loadPosts(context)
    .map((post) => ({
      year: post.date.getUTCFullYear(),
      month: post.date.getUTCMonth() + 1,
    }))
    .sort((d1, d2) =>
      d1.year === d2.year ? d2.month - d1.month : d2.year - d1.year,
    )
    .filter((d) => {
      const hash = `${d.year}-${100 * d.month}`;
      if (takenDates.has(hash)) {
        return false;
      }

      takenDates.add(hash);
      return true;
    });
}

module.exports = {
  loadAllPosts,
  loadPostsByDate,
  loadPostsByTag,
  loadTags,
  loadDates,
};
