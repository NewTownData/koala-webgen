const rssContentProvider = require('../../src/content/rssContentProvider');
const createFeed = require('../../src/feed/createFeed');
const loadPosts = require('../../src/posts/loadPosts');

jest.mock('../../src/posts/loadPosts');
jest.mock('../../src/feed/createFeed');

describe('rssContentProvider', () => {
  beforeEach(() => {
    createFeed.mockClear();
    loadPosts.mockClear();
  });

  it('valid - more posts', () => {
    const feedItems = [];

    loadPosts.mockImplementation(() => [{}, {}, {}]);
    createFeed.mockImplementation(() => ({
      addItem(item) {
        feedItems.push(item);
      },
      build() {
        return '';
      },
    }));

    const result = rssContentProvider(
      {
        configuration: {
          feedSize: 2,
        },
      },
      ['feed.rss']
    );
    expect(result).toEqual({
      headers: {
        'Content-Type': 'application/rss+xml',
      },
      payload: '',
      type: 'file',
    });
    expect(feedItems.length).toBe(2);
  });

  it('valid - feed size', () => {
    const feedItems = [];

    loadPosts.mockImplementation(() => [{}]);
    createFeed.mockImplementation(() => ({
      addItem(item) {
        feedItems.push(item);
      },
      build() {
        return '';
      },
    }));

    const result = rssContentProvider(
      {
        configuration: {
          feedSize: 100,
        },
      },
      ['feed.rss']
    );
    expect(result).toEqual({
      headers: {
        'Content-Type': 'application/rss+xml',
      },
      payload: '',
      type: 'file',
    });
    expect(feedItems.length).toBe(1);
  });

  it('invalid - no feed', () => {
    const result = rssContentProvider({}, []);
    expect(result).toEqual(null);
  });
});
