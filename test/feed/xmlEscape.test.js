const xmlEscape = require('../../src/feed/xmlEscape');

describe('xmlEscape', () => {
  it('works', () => {
    expect(xmlEscape('')).toBe('');
    expect(xmlEscape('a')).toBe('a');
    expect(xmlEscape('&')).toBe('&amp;');
    expect(xmlEscape('<')).toBe('&lt;');
    expect(xmlEscape('>')).toBe('&gt;');
    expect(xmlEscape('"')).toBe('&quot;');
    expect(xmlEscape("'")).toBe('&apos;');
    expect(xmlEscape('Test<"message">&blog\'test')).toBe(
      'Test&lt;&quot;message&quot;&gt;&amp;blog&apos;test',
    );
  });
});
