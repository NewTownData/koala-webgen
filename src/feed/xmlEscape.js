module.exports = function (value) {
  if (!value) {
    return value;
  }

  let result = '';
  [...value].forEach((character) => {
    switch (character) {
      case '&':
        result += '&amp;';
        break;
      case '<':
        result += '&lt;';
        break;
      case '>':
        result += '&gt;';
        break;
      case '"':
        result += '&quot;';
        break;
      case "'":
        result += '&apos;';
        break;
      default:
        result += character;
        break;
    }
  });

  return result;
};
