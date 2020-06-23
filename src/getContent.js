const path = require('path');
const fs = require('fs');

const loadPosts = require('./loadPosts');
const loadPost = require('./loadPost');
const loadTextFile = require('./loadTextFile');
const detectMimeType = require('./detectMimeType');

function getContent(pathName, contentPaths) {
  const { pagesPath, postsPath, staticPath, themePath } = contentPaths;

  if (pathName === '/') {
    console.log('Root');
    // root
    return { type: 'html', posts: loadPosts(postsPath), pathName };
  }

  let relativePath = pathName;
  if (pathName.indexOf('/') === 0) {
    relativePath = relativePath.substring(1);
  }

  // 1. check page
  const pageFile = path.join(pagesPath, relativePath);
  if (fs.existsSync(pageFile)) {
    console.log(`Page ${pageFile}`);
    return {
      type: 'html',
      page: loadPost(pathName, loadTextFile(pageFile), false),
      pathName,
    };
  }

  // 2. check post
  const postFile = path.join(postsPath, relativePath);
  if (fs.existsSync(postFile)) {
    console.log(`Post ${postFile}`);
    return {
      type: 'html',
      posts: [loadPost(pathName, loadTextFile(postFile), false)],
      pathName,
    };
  }

  // 3. check static
  const staticFile = path.join(staticPath, relativePath);
  if (fs.existsSync(staticFile)) {
    console.log(`Static ${staticFile}`);

    return {
      type: 'file',
      content: fs.readFileSync(staticFile),
      mimeType: detectMimeType(pathName),
    };
  }

  // 4. check theme
  const themeFile = path.join(themePath, relativePath);
  if (fs.existsSync(themeFile)) {
    console.log(`Theme ${themeFile}`);
    return {
      type: 'file',
      content: fs.readFileSync(themeFile),
      mimeType: detectMimeType(pathName),
    };
  }

  console.warn(`No file found for ${pathName}`);
  return { type: '404', pathName };
}

module.exports = getContent;
