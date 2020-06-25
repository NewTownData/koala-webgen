function convertMonth(month) {
  return month < 10 ? `0${month}` : `${month}`;
}

function allPostsUrlFactory() {
  return (pageNumber) => {
    if (pageNumber === 1) {
      return '/';
    }

    return `/posts/page-${pageNumber}.html`;
  };
}

function postsByTagUrlFactory(tag) {
  return (pageNumber) =>
    `/tags/${encodeURIComponent(tag)}/page-${pageNumber}.html`;
}

function postsByDateUrlFactory(date) {
  const { year, month } = date;
  return (pageNumber) =>
    `/archive/${year}-${convertMonth(month)}/page-${pageNumber}.html`;
}

module.exports = {
  allPostsUrlFactory,
  postsByDateUrlFactory,
  postsByTagUrlFactory,
  convertMonth,
};
