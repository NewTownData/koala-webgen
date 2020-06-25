function paginate(results, pageSize) {
  const pages = [];

  let currentPage;
  for (let i = 0; i < results.length; i += 1) {
    if (i % pageSize === 0) {
      currentPage = [];
      pages.push(currentPage);
    }

    currentPage.push(results[i]);
  }

  return pages;
}

module.exports = paginate;
