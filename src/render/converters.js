const { format } = require('date-fns');
const {
  postsByDateUrlFactory,
  postsByTagUrlFactory,
} = require('../path/urlFactory');

function convertArchive(context, date) {
  const { year, month } = date;
  const {
    configuration: { websitePath },
  } = context;

  return {
    name: format(new Date(year, month - 1, 1), 'MMMM yyyy'),
    link: `${websitePath}${postsByDateUrlFactory(date)(1)}`,
  };
}

function convertTag(context, tag) {
  const {
    configuration: { websitePath },
  } = context;

  return { name: tag, link: `${websitePath}${postsByTagUrlFactory(tag)(1)}` };
}

module.exports = { convertArchive, convertTag };
