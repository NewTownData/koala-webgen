const { format } = require('date-fns');
const { postsByDateUrlFactory, postsByTagUrlFactory } = require('./urlFactory');

function convertArchive(date) {
  const { year, month } = date;
  return {
    url: postsByDateUrlFactory(date)(1),
    title: format(new Date(year, month - 1, 1), 'MMMM yyyy'),
  };
}

function convertTag(tag) {
  return { url: postsByTagUrlFactory(tag)(1), title: tag };
}

module.exports = { convertArchive, convertTag };
