module.exports = (context, pathComponents) => {
  const { configuration } = context;
  const { websitePath } = configuration;

  let path = websitePath;
  for (let i = 0; i < pathComponents.length; i += 1) {
    if (i !== 0) {
      path += '/';
    }
    path += encodeURIComponent(pathComponents[i]);
  }
  return path;
};
