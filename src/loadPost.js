function loadPost(pathName, content, trim) {
  const date = /<!-- date: ([0-9]{4})-([0-9]{2})-([0-9]{2}) ([0-9]{2}):([0-9]{2}):([0-9]{2}) -->/.exec(
    content
  );
  const tags = /<!-- tags: (.*?) -->/.exec(content);
  const title = /<!-- title: (.*?) -->/.exec(content);

  let result = content;
  const idx = content.indexOf('<!-- more -->');
  if (trim && idx >= 0) {
    result = content.substring(0, idx);
  }

  // clear comments and whitespace
  result = result.replace(/<!-- (.*?) -->\s*/gm, '');

  if (!title || !date) {
    throw new Error(`Cannot load title or date for ${pathName}`);
  }

  return {
    title: title[1],
    url: pathName,
    date: new Date(
      parseInt(date[1], 10),
      parseInt(date[2], 10) - 1,
      parseInt(date[3], 10),
      parseInt(date[4], 10),
      parseInt(date[5], 10),
      parseInt(date[6], 10)
    ),
    tags: tags ? tags[1].split(',') : [],
    content: result,
    preview: trim,
  };
}

module.exports = loadPost;
