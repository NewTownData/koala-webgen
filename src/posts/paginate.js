function paginate(context, results, urlFactory) {
  const { configuration } = context;
  const { pageSize, websitePath } = configuration;

  const pages = [];

  let currentPage;
  for (let i = 0; i < results.length; i += 1) {
    if (i % pageSize === 0) {
      currentPage = [];
      pages.push({
        items: currentPage,
        link: `${websitePath}${urlFactory(Math.floor(i / pageSize) + 1)}`,
      });
    }

    currentPage.push(results[i]);
  }

  return pages;
}

module.exports = paginate;
