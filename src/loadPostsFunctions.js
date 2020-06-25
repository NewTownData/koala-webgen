const loadPosts = require('./loadPosts');
const paginate = require('./paginate');

function loadAllPosts(postsPath, pageSize) {
  const posts = loadPosts(postsPath);
  return paginate(posts, pageSize);
}

function loadPostsByDate(postsPath, pageSize, year, month) {
  const posts = loadPosts(postsPath).filter(
    (post) =>
      post.date.getFullYear() === year && post.date.getMonth() + 1 === month
  );
  return paginate(posts, pageSize);
}

function loadPostsByTag(postsPath, pageSize, tag) {
  const posts = loadPosts(postsPath).filter((post) => post.tags.includes(tag));
  return paginate(posts, pageSize);
}

function loadTags(postsPath) {
  const tags = loadPosts(postsPath)
    .map((post) => post.tags)
    .reduce((previous, current) => {
      previous.push(...current);
      return previous;
    }, []);

  // unique tags
  return [...new Set(tags)].sort();
}

function loadDates(postsPath) {
  const takenDates = new Set();

  return loadPosts(postsPath)
    .map((post) => ({
      year: post.date.getFullYear(),
      month: post.date.getMonth() + 1,
    }))
    .sort((d1, d2) =>
      d1.year === d2.year ? d2.month - d1.month : d2.year - d1.year
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
