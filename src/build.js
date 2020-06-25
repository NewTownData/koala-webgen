const fs = require('fs');
const path = require('path');
const getConfiguration = require('./getConfiguration');
const getContentPaths = require('./getContentPaths');
const renderPage = require('./renderPage');
const { initTemplates } = require('./templates');
const {
  loadAllPosts,
  loadTags,
  loadPostsByTag,
  loadDates,
  loadPostsByDate,
} = require('./loadPostsFunctions');
const handleSpecialPath = require('./handleSpecialPath');
const {
  allPostsUrlFactory,
  postsByTagUrlFactory,
  postsByDateUrlFactory,
  convertMonth,
} = require('./urlFactory');
const { getPageContent, getPostContent } = require('./getContent');

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

  const { render, urlPrefix } = copyConfig;

  const url = `${urlPrefix}/${path.basename(fromFile)}`;
  const output = render(url, fromFile);
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
      copyPosts(path.join(fromPath, f.name), path.join(toPath, f.name), {
        ...copyConfig,
        urlPrefix: `${copyConfig.urlPrefix}/${f.name}`,
      });
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

function copyAllPosts(
  postsPath,
  pageSize,
  destination,
  configuration,
  contentPaths
) {
  const postPages = loadAllPosts(postsPath, pageSize);
  for (let i = 0; i < postPages.length; i += 1) {
    const pageOutput = handleSpecialPath(
      i === 0 ? '/' : allPostsUrlFactory()(i + 1),
      postsPath,
      pageSize
    );
    const indexOutput = renderPage(pageOutput, configuration, contentPaths);

    if (i === 0) {
      fs.writeFileSync(path.join(destination, 'index.html'), indexOutput);
    } else {
      const dir = path.join(destination, 'posts');
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      fs.writeFileSync(path.join(dir, `page-${i + 1}.html`), indexOutput);
    }
  }
}

function copyPostsByTag(
  tag,
  postsPath,
  pageSize,
  destination,
  configuration,
  contentPaths
) {
  const postPages = loadPostsByTag(postsPath, pageSize, tag);
  for (let i = 0; i < postPages.length; i += 1) {
    const pageOutput = handleSpecialPath(
      postsByTagUrlFactory(tag)(i + 1),
      postsPath,
      pageSize
    );
    const indexOutput = renderPage(pageOutput, configuration, contentPaths);

    const dir = path.join(destination, 'tags', tag);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(path.join(dir, `page-${i + 1}.html`), indexOutput);
  }
}

function copyPostsByDate(
  date,
  postsPath,
  pageSize,
  destination,
  configuration,
  contentPaths
) {
  const { year, month } = date;
  const postPages = loadPostsByDate(postsPath, pageSize, year, month);
  for (let i = 0; i < postPages.length; i += 1) {
    const pageOutput = handleSpecialPath(
      postsByDateUrlFactory(date)(i + 1),
      postsPath,
      pageSize
    );
    const indexOutput = renderPage(pageOutput, configuration, contentPaths);

    const dir = path.join(
      destination,
      'archive',
      `${year}-${convertMonth(month)}`
    );
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(path.join(dir, `page-${i + 1}.html`), indexOutput);
  }
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
  const { pageSize } = configuration;

  initTemplates(configuration, themePath);

  fs.mkdirSync(destination, { recursive: true });

  copyAllPosts(postsPath, pageSize, destination, configuration, contentPaths);

  const tags = loadTags(postsPath);
  tags.forEach((tag) => {
    copyPostsByTag(
      tag,
      postsPath,
      pageSize,
      destination,
      configuration,
      contentPaths
    );
  });

  const archive = loadDates(postsPath);
  archive.forEach((date) => {
    copyPostsByDate(
      date,
      postsPath,
      pageSize,
      destination,
      configuration,
      contentPaths
    );
  });

  // pages
  copyPosts(pagesPath, destination, {
    urlPrefix: '',
    render: (url, fromFile) =>
      renderPage(getPageContent(url, fromFile), configuration, contentPaths),
  });

  // posts
  copyPosts(postsPath, destination, {
    urlPrefix: '',
    render: (url, fromFile) =>
      renderPage(getPostContent(url, fromFile), configuration, contentPaths),
  });

  copyAssets(staticPath, destination);
  copyAssets(themePath, destination);
}

module.exports = build;
