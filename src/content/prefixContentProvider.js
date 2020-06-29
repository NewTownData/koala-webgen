const {
  loadAllPosts,
  loadPostsByTag,
  loadPostsByDate,
} = require('../posts/loadPostsFunctions');

function createContent(pages, pageNumber) {
  const computerPageNumber = pageNumber - 1;
  if (computerPageNumber < 0 || pages.length <= computerPageNumber) {
    return null;
  }

  const { title, items } = pages;
  const page = items[computerPageNumber];

  const pagination = {
    pageNumber,
  };

  if (computerPageNumber > 0) {
    pagination.previousLink = items[computerPageNumber - 1].link;
  }
  if (computerPageNumber + 1 < items.length) {
    pagination.nextLink = items[computerPageNumber + 1].link;
  }

  return {
    type: 'content',
    content: {
      posts: {
        title,
        items: page.items,
        pagination,
      },
    },
  };
}

function parsePageNumber(pathComponent) {
  const pageResult = /^page-([0-9]+).html$/.exec(pathComponent);
  if (pageResult) {
    try {
      return parseInt(pageResult[1], 10);
    } catch (e) {
      console.warn(`Invalid page number for ${pathComponent}: ${e.message}`);
      return 0;
    }
  }
  return 0;
}

module.exports = (context, pathComponents) => {
  // index
  if (pathComponents.length === 0) {
    return createContent(loadAllPosts(context), 1);
  }

  // posts
  if (pathComponents.length === 2 && pathComponents[0] === 'posts') {
    const pageNumber = parsePageNumber(pathComponents[1]);
    if (pageNumber > 0) {
      return createContent(loadAllPosts(context), pageNumber);
    }
  }

  // tag
  if (pathComponents.length === 3 && pathComponents[0] === 'tags') {
    const tag = pathComponents[1];
    const pageNumber = parsePageNumber(pathComponents[2]);
    if (pageNumber > 0) {
      return createContent(loadPostsByTag(context, tag), pageNumber);
    }
  }

  // archive
  if (pathComponents.length === 3 && pathComponents[0] === 'archive') {
    const archiveResult = /^([0-9]{4})-([0-9]{2})$/.exec(pathComponents[1]);
    const pageNumber = parsePageNumber(pathComponents[2]);
    if (pageNumber > 0 && archiveResult) {
      const year = parseInt(archiveResult[1], 10);
      const month = parseInt(archiveResult[2], 10);

      return createContent(loadPostsByDate(context, year, month), pageNumber);
    }
  }

  return null;
};
