const fs = require('fs');
const path = require('path');
const {
  loadAllPosts,
  loadTags,
  loadPostsByTag,
  loadDates,
  loadPostsByDate,
} = require('../posts/loadPostsFunctions');
const { convertMonth } = require('../path/urlFactory');
const createContext = require('../context/createContext');
const { executeWithContext } = require('../generator');
const encodePath = require('../path/encodePath');

function ensureParentExists(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function copyPost(context, pathComponents, toFile) {
  if (fs.existsSync(toFile)) {
    console.warn(`Skipping already created file ${toFile}`);
    return;
  }

  const requestPath = encodePath(context, pathComponents);
  const { payload } = executeWithContext(context, requestPath);
  fs.writeFileSync(toFile, payload);
}

function copyPostsWithPathComponents(
  context,
  fromPath,
  toPath,
  pathComponents
) {
  const items = fs.readdirSync(fromPath, {
    encoding: 'utf-8',
    withFileTypes: true,
  });

  items
    .filter((f) => f.isFile() && /.*\.html/.test(f.name))
    .forEach((f) => {
      ensureParentExists(path.join(toPath, f.name));
      copyPost(context, [...pathComponents, f.name], path.join(toPath, f.name));
    });

  items
    .filter((f) => f.isDirectory())
    .forEach((f) => {
      copyPostsWithPathComponents(
        context,
        path.join(fromPath, f.name),
        path.join(toPath, f.name),
        [...pathComponents, f.name]
      );
    });
}

function copyPosts(context, fromPath, toPath) {
  copyPostsWithPathComponents(context, fromPath, toPath, []);
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

function copyAllPosts(context, destination) {
  const { items } = loadAllPosts(context);
  for (let i = 0; i < items.length; i += 1) {
    const requestPath = items[i].link;
    const { payload } = executeWithContext(context, requestPath);

    if (i === 0) {
      fs.writeFileSync(path.join(destination, 'index.html'), payload);
    } else {
      const dir = path.join(destination, 'posts');
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      fs.writeFileSync(path.join(dir, `page-${i + 1}.html`), payload);
    }
  }
}

function copyPostsByTag(tag, context, destination) {
  const { items } = loadPostsByTag(context, tag);
  for (let i = 0; i < items.length; i += 1) {
    const requestPath = items[i].link;
    const { payload } = executeWithContext(context, requestPath);

    const dir = path.join(destination, 'tags', tag);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(path.join(dir, `page-${i + 1}.html`), payload);
  }
}

function copyPostsByDate(date, context, destination) {
  const { year, month } = date;
  const { items } = loadPostsByDate(context, year, month);
  for (let i = 0; i < items.length; i += 1) {
    const requestPath = items[i].link;
    const { payload } = executeWithContext(context, requestPath);

    const dir = path.join(
      destination,
      'archive',
      `${year}-${convertMonth(month)}`
    );
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(path.join(dir, `page-${i + 1}.html`), payload);
  }
}

function copyFeed(context, toPath) {
  const { configuration } = context;
  const { websitePath } = configuration;

  const { payload } = executeWithContext(
    context,
    `${websitePath}/feed.rss.xml`
  );
  fs.writeFileSync(path.join(toPath, 'feed.rss.xml'), payload);
}

function build(websiteRoot, destination) {
  console.log(`Building ${websiteRoot} to ${destination} ...`);

  const context = createContext(websiteRoot);

  if (fs.existsSync(destination)) {
    console.debug(`Deleting destination ${destination}`);
    fs.rmSync(destination, { recursive: true });
  }

  fs.mkdirSync(destination, { recursive: true });

  copyAllPosts(context, destination);

  const tags = loadTags(context);
  tags.forEach((tag) => {
    copyPostsByTag(tag, context, destination);
  });

  const archive = loadDates(context);
  archive.forEach((date) => {
    copyPostsByDate(date, context, destination);
  });

  const {
    paths: {
      posts: postsPath,
      pages: pagesPath,
      static: staticPath,
      theme: themePath,
    },
  } = context;

  // pages
  copyPosts(context, pagesPath, destination);

  // posts
  copyPosts(context, postsPath, destination);

  copyAssets(staticPath, destination);
  copyAssets(themePath, destination);

  copyFeed(context, destination);
}

module.exports = build;
