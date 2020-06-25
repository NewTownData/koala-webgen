const { format } = require('date-fns');
const {
  loadAllPosts,
  loadPostsByDate,
  loadPostsByTag,
} = require('./loadPostsFunctions');
const {
  allPostsUrlFactory,
  postsByTagUrlFactory,
  postsByDateUrlFactory,
} = require('./urlFactory');

function createResult(pathName, pages, pageNumber, urlFactory, title) {
  const computerPageNumber = pageNumber - 1;
  if (computerPageNumber < 0 || pages.length <= computerPageNumber) {
    return { type: '404' };
  }

  const result = {
    type: 'html',
    pages: pages[computerPageNumber],
    title,
    pageNumber,
    pathName,
  };
  if (computerPageNumber > 0) {
    result.previousPageUrl = urlFactory(pageNumber - 1);
  }
  if (computerPageNumber + 1 < pages.length) {
    result.nextPageUrl = urlFactory(pageNumber + 1);
  }
  if (title) {
    result.pageTitle = `${title} - Page ${pageNumber}`;
  } else {
    result.title = 'Posts';
  }
  return result;
}

function handleSpecialPath(pathName, postsPath, pageSize) {
  if (pathName === '/') {
    return createResult(
      pathName,
      loadAllPosts(postsPath, pageSize),
      1,
      allPostsUrlFactory()
    );
  }

  const pageResult = /^\/posts\/page-([0-9]+).html$/.exec(pathName);
  if (pageResult) {
    const pageNumber = parseInt(pageResult[1], 10);
    return createResult(
      pathName,
      loadAllPosts(postsPath, pageSize),
      pageNumber,
      allPostsUrlFactory(),
      `Posts`
    );
  }

  const tagResult = /^\/tags\/(.*?)\/page-([0-9]+).html$/.exec(pathName);
  if (tagResult) {
    const tag = decodeURIComponent(tagResult[1]);
    const pageNumber = parseInt(tagResult[2], 10);

    return createResult(
      pathName,
      loadPostsByTag(postsPath, pageSize, tag),
      pageNumber,
      postsByTagUrlFactory(tag),
      `Tag ${tag}`
    );
  }

  const archiveResult = /^\/archive\/([0-9]{4})-([0-9]{2})\/page-([0-9]+).html$/.exec(
    pathName
  );
  if (archiveResult) {
    const year = parseInt(archiveResult[1], 10);
    const month = parseInt(archiveResult[2], 10);
    const pageNumber = parseInt(archiveResult[3], 10);

    return createResult(
      pathName,
      loadPostsByDate(postsPath, pageSize, year, month),
      pageNumber,
      postsByDateUrlFactory({ year, month }),
      `Archive ${format(new Date(year, month - 1, 1), 'MMMM yyyy')}`
    );
  }

  return { type: '404' };
}

module.exports = handleSpecialPath;
