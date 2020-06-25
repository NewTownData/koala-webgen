const path = require('path');
const fs = require('fs');

const loadPost = require('./loadPost');
const loadTextFile = require('./loadTextFile');
const detectMimeType = require('./detectMimeType');
const handleSpecialPath = require('./handleSpecialPath');
const { convertTag } = require('./converters');

function getPageContent(pathName, pageFile) {
  const pageResult = loadPost(pathName, loadTextFile(pageFile), false);
  return {
    type: 'html',
    page: {
      ...pageResult,
    },
    title: pageResult.title,
    pathName,
  };
}

function getPostContent(pathName, postFile) {
  const postResult = loadPost(pathName, loadTextFile(postFile), false);
  return {
    type: 'html',
    post: {
      ...postResult,
      tags: postResult.tags.map((tag) => convertTag(tag)),
    },
    title: postResult.title,
    pathName,
  };
}

function getContent(pathName, contentPaths, pageSize) {
  const { pagesPath, postsPath, staticPath, themePath } = contentPaths;

  const result = handleSpecialPath(pathName, postsPath, pageSize);
  if (result.type !== '404') {
    console.log(`Special path ${pathName}`);
    return result;
  }

  let relativePath = pathName;
  if (pathName.indexOf('/') === 0) {
    relativePath = relativePath.substring(1);
  }

  // 1. check page
  const pageFile = path.join(pagesPath, relativePath);
  if (fs.existsSync(pageFile)) {
    console.log(`Page ${pageFile}`);
    return getPageContent(pathName, pageFile);
  }

  // 2. check post
  const postFile = path.join(postsPath, relativePath);
  if (fs.existsSync(postFile)) {
    console.log(`Post ${postFile}`);
    return getPostContent(pathName, postFile);
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

module.exports = { getContent, getPostContent, getPageContent };
