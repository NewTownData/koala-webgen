const extractDescription = require('../feed/extractDescription');

function loadPost(postPath, content, trim) {
  const date =
    /<!-- date: ([0-9]{4})-([0-9]{2})-([0-9]{2}) ([0-9]{2}):([0-9]{2}):([0-9]{2}) -->/.exec(
      content,
    );
  const tags = /<!-- tags: (.*?) -->/.exec(content);
  const title = /<!-- title: (.*?) -->/.exec(content);

  let result = content;
  let descriptionInput = content;
  const idx = content.indexOf('<!-- more -->');
  if (idx >= 0) {
    descriptionInput = content.substring(0, idx);
  }

  if (trim) {
    result = descriptionInput;
  }

  // clear comments and whitespace
  result = result.replace(/<!-- (.*?) -->\s*/gm, '');

  if (!title || !date) {
    throw new Error(`Cannot load title or date for ${postPath}`);
  }

  return {
    title: title[1],
    description: extractDescription(descriptionInput),
    link: postPath,
    date: new Date(
      Date.UTC(
        parseInt(date[1], 10),
        parseInt(date[2], 10) - 1,
        parseInt(date[3], 10),
        parseInt(date[4], 10),
        parseInt(date[5], 10),
        parseInt(date[6], 10),
      ),
    ),
    tags: tags ? tags[1].split(',') : [],
    body: result,
  };
}

module.exports = loadPost;
