const fs = require('fs');
const path = require('path');
const getConfiguration = require('./getConfiguration');
const getContentPaths = require('./getContentPaths');
const loadTextFile = require('./loadTextFile');
const loadPost = require('./loadPost');
const renderPage = require('./renderPage');
const { initTemplates } = require('./templates');
const loadPosts = require('./loadPosts');

function ensureParentExists(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function copyPost(fromFile, toFile, copyConfig) {
  if (fs.existsSync(toFile)) {
    console.warn(`Skipping already created file ${toFile}`);
    return;
  }

  const { rootPath, render } = copyConfig;

  const url = `/${path.relative(fromFile, rootPath)}`;
  const content = loadPost(url, loadTextFile(fromFile), false);
  const output = render(url, content);
  fs.writeFileSync(toFile, output);
}

function copyPosts(fromPath, toPath, copyConfig) {
  const items = fs.readdirSync(fromPath, {
    encoding: 'utf-8',
    withFileTypes: true,
  });

  items
    .filter((f) => f.isFile() && /.*\.html/.test(f.name))
    .forEach((f) => {
      ensureParentExists(path.join(toPath, f.name));
      copyPost(
        path.join(fromPath, f.name),
        path.join(toPath, f.name),
        copyConfig
      );
    });

  items
    .filter((f) => f.isDirectory())
    .forEach((f) => {
      copyPosts(
        path.join(fromPath, f.name),
        path.join(toPath, f.name),
        copyConfig
      );
    });
}

function copyAssets(fromPath, toPath) {
  const items = fs.readdirSync(fromPath, {
    encoding: 'utf-8',
    withFileTypes: true,
  });

  items
    .filter((f) => f.isFile() && !/.*\.html/.test(f.name))
    .forEach((f) => {
      ensureParentExists(path.join(toPath, f.name));
      fs.copyFileSync(path.join(fromPath, f.name), path.join(toPath, f.name));
    });

  items
    .filter((f) => f.isDirectory())
    .forEach((f) => {
      copyAssets(path.join(fromPath, f.name), path.join(toPath, f.name));
    });
}

function build(websiteRoot, destination) {
  console.log(`Building ${websiteRoot} to ${destination} ...`);

  if (fs.existsSync(destination)) {
    console.debug(`Deleting destination ${destination}`);
    fs.rmdirSync(destination, { recursive: true });
  }

  const configuration = getConfiguration(websiteRoot);
  const contentPaths = getContentPaths(websiteRoot, configuration);

  const { pagesPath, postsPath, staticPath, themePath } = contentPaths;

  initTemplates(configuration, themePath);

  fs.mkdirSync(destination, { recursive: true });

  // index.html
  const indexOutput = renderPage(
    {
      type: 'html',
      posts: loadPosts(postsPath),
      pathName: '/',
    },
    configuration,
    contentPaths
  );
  fs.writeFileSync(path.join(destination, 'index.html'), indexOutput);

  // pages
  copyPosts(pagesPath, destination, {
    rootPath: pagesPath,
    render: (url, content) =>
      renderPage(
        {
          type: 'html',
          page: content,
          pathName: url,
        },
        configuration,
        contentPaths
      ),
  });

  // posts
  copyPosts(postsPath, destination, {
    rootPath: pagesPath,
    render: (url, content) =>
      renderPage(
        {
          type: 'html',
          posts: [content],
          pathName: url,
        },
        configuration,
        contentPaths
      ),
  });

  copyAssets(staticPath, destination);
  copyAssets(themePath, destination);
}

module.exports = build;
