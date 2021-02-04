module.exports = function (body) {
  if (!body) {
    return body;
  }

  let extractedBody = '';
  let inTag = false;
  [...body].forEach((character) => {
    if (inTag) {
      if (character === '>') {
        inTag = false;
      }
      return;
    }

    if (character === '<') {
      inTag = true;
      extractedBody += ' ';
      return;
    }

    extractedBody += character;
  });

  return extractedBody.replace(/\s+/g, ' ').trim();
};
