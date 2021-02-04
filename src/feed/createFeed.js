const extractDescription = require('./extractDescription');
const xmlEscape = require('./xmlEscape');

module.exports = function (configuration, publishedDate) {
  const { title, subtitle, description, url, websitePath } = configuration;
  const published = publishedDate.toUTCString();

  const header = `
    <title>${xmlEscape(`${title} - ${subtitle}`)}</title>
    <description>${xmlEscape(description)}</description>
    <link>${xmlEscape(`${url}${websitePath}`)}</link>
    <lastBuildDate>${xmlEscape(published)}</lastBuildDate>
    <pubDate>${xmlEscape(published)}</pubDate>`;

  let items = '';

  function addItem(post) {
    const { title: postTitle, body, link, date } = post;
    const postUrl = `${url}${link}`;
    const content = extractDescription(body);

    items += `
    <item>
      <title>${xmlEscape(postTitle)}</title>
      <description>${xmlEscape(content)}</description>
      <link>${xmlEscape(postUrl)}</link>
      <guid>${xmlEscape(postUrl)}</guid>
      <pubDate>${xmlEscape(date.toUTCString())}</pubDate>
    </item>`;
  }

  function build() {
    return `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>${header}${items}
  </channel>
</rss>`;
  }

  return {
    addItem,
    build,
  };
};
