const createFeed = require('../../src/feed/createFeed');

describe('createFeed', () => {
  it('works', () => {
    const publishedDate = new Date(Date.UTC(2020, 5, 15, 16, 17, 50));

    const feed = createFeed(
      {
        title: 'Test',
        subtitle: 'Blog',
        description: 'Blog & Feed',
        url: 'https://www.example.com',
        websitePath: '/',
      },
      publishedDate
    );

    feed.addItem({
      title: 'Post 1',
      link: '/post1.html',
      date: new Date(Date.UTC(2020, 2, 15, 16, 17, 50)),
      body: '<p>Post 1 summary</p>',
    });

    feed.addItem({
      title: 'Post 2',
      link: '/post2.html',
      date: new Date(Date.UTC(2020, 1, 15, 16, 17, 50)),
      body: 'Post 2 <i>summary</i>',
    });

    const result = feed.build();
    expect(result).toBe(`<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>Test - Blog</title>
    <description>Blog &amp; Feed</description>
    <link>https://www.example.com/</link>
    <lastBuildDate>Mon, 15 Jun 2020 16:17:50 GMT</lastBuildDate>
    <pubDate>Mon, 15 Jun 2020 16:17:50 GMT</pubDate>
    <item>
      <title>Post 1</title>
      <description>Post 1 summary</description>
      <link>https://www.example.com/post1.html</link>
      <guid>https://www.example.com/post1.html</guid>
      <pubDate>Sun, 15 Mar 2020 16:17:50 GMT</pubDate>
    </item>
    <item>
      <title>Post 2</title>
      <description>Post 2 summary</description>
      <link>https://www.example.com/post2.html</link>
      <guid>https://www.example.com/post2.html</guid>
      <pubDate>Sat, 15 Feb 2020 16:17:50 GMT</pubDate>
    </item>
  </channel>
</rss>`);
  });
});
