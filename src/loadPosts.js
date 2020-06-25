const path = require('path');
const fs = require('fs');
const loadPost = require('./loadPost');
const loadTextFile = require('./loadTextFile');

function loadPosts(postsPath) {
  const items = fs.readdirSync(postsPath, 'utf-8');
  return items
    .filter((name) => /.*\.html/.test(name))
    .map((name) =>
      loadPost(`/${name}`, loadTextFile(path.join(postsPath, name)), true)
    )
    .sort((post1, post2) => post2.date.getTime() - post1.date.getTime());
}

module.exports = loadPosts;
