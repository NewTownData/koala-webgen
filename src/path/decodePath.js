module.exports = (path) => {
  if (!path) {
    return [];
  }

  let pathForSplit = path;
  if (pathForSplit.indexOf('/') === 0) {
    pathForSplit = pathForSplit.substring(1);
  }

  const components = pathForSplit.split('/');
  return components.map((c) => decodeURIComponent(c));
};
