const path = require('path');
const fs = require('fs');
const loadPost = require('./loadPost');
const loadTextFile = require('./loadTextFile');

function loadPostFiles(prefix, currentPath) {
  const items = fs.readdirSync(currentPath, {
    encoding: 'utf-8',
    withFileTypes: true,
  });

  const result = [];

  items
    .filter((f) => f.isFile())
    .map((f) => f.name)
    .filter((name) => /.*\.html/.test(name))
    .map((name) =>
      loadPost(
        `${prefix}/${name}`,
        loadTextFile(path.join(currentPath, name)),
        true
      )
    )
    .forEach((item) => result.push(item));

  items
    .filter((f) => f.isDirectory())
    .map((f) => f.name)
    .map((name) =>
      loadPostFiles(`${prefix}/${name}`, path.join(currentPath, name))
    )
    .forEach((arr) => result.push(...arr));

  return result;
}

function loadPosts(postsPath) {
  const items = loadPostFiles('', postsPath);
  return items.sort(
    (post1, post2) => post2.date.getTime() - post1.date.getTime()
  );
}

module.exports = loadPosts;
