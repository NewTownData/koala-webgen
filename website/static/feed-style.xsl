<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="3.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes" />
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml" lang="en">
      <head>
        <title>RSS Feed | <xsl:value-of select="/rss/channel/title" /></title>
      </head>
      <body style="background-color: #f0f0f0; padding: 20px;">
        <p>This is an RSS feed for <a>
            <xsl:attribute name="href">
              <xsl:value-of select="/rss/channel/link" />
            </xsl:attribute>
            <xsl:value-of select="/rss/channel/title" />
          </a> - <xsl:value-of
            select="/rss/channel/description" />. You need to subscribe via an RSS reader to consume
  the updates.</p>
        <h1>Recent Updates</h1>
        <xsl:for-each select="/rss/channel/item">
          <div
            style="margin-top: 10px; background-color: #fff; border-radius: 10px; padding: 10px 14px;">
            <h2 style="margin: 0; padding: 0;">
              <a>
                <xsl:attribute name="href">
                  <xsl:value-of select="link" />
                </xsl:attribute>
                <xsl:value-of select="title" />
              </a>
            </h2>
            <p style="margin: 4px 0; color: #aaa;">
              <xsl:value-of select="pubDate" />
            </p>
            <p style="margin: 4px 0">
              <xsl:value-of select="description" />
            </p>
          </div>
        </xsl:for-each>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>