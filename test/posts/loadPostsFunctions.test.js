const loadPosts = require('../../src/posts/loadPosts');
const {
  loadAllPosts,
  loadPostsByDate,
  loadPostsByTag,
  loadTags,
  loadDates,
} = require('../../src/posts/loadPostsFunctions');

jest.mock('../../src/posts/loadPosts');

const context = {
  configuration: {
    websitePath: '/x/',
    pageSize: 2,
  },
  paths: {
    posts: 'a/b/c',
  },
};

describe('loadPosts', () => {
  beforeEach(() => {
    loadPosts.mockClear();
  });

  it('loadAllPosts', () => {
    loadPosts.mockImplementation(() => ['a', 'b', 'c']);
    expect(loadAllPosts(context)).toEqual({
      items: [
        { items: ['a', 'b'], link: '/x/' },
        { items: ['c'], link: '/x/posts/page-2.html' },
      ],
      title: 'Posts',
    });

    expect(loadPosts).toHaveBeenCalledTimes(1);
    expect(loadPosts).toHaveBeenCalledWith(context);
  });

  it('loadPostsByDate 2019-01', () => {
    loadPosts.mockImplementation(() => [
      { title: 'a', date: new Date('2020-02-03T10:00:00') },
      { title: 'b', date: new Date('2019-02-03T10:00:00') },
      { title: 'c', date: new Date('2019-01-01T10:00:00') },
      { title: 'd', date: new Date('2019-01-02T10:00:00') },
      { title: 'e', date: new Date('2019-01-03T10:00:00') },
    ]);
    expect(loadPostsByDate(context, 2019, 1)).toEqual({
      items: [
        {
          items: [
            { title: 'c', date: new Date('2019-01-01T10:00:00') },
            { title: 'd', date: new Date('2019-01-02T10:00:00') },
          ],
          link: '/x/archive/2019-01/page-1.html',
        },
        {
          items: [{ title: 'e', date: new Date('2019-01-03T10:00:00') }],
          link: '/x/archive/2019-01/page-2.html',
        },
      ],
      title: 'Archive January 2019',
    });

    expect(loadPosts).toHaveBeenCalledTimes(1);
    expect(loadPosts).toHaveBeenCalledWith(context);
  });

  it('loadPostsByTag xyz', () => {
    loadPosts.mockImplementation(() => [
      { title: 'a', tags: ['a', 'b'] },
      { title: 'b', tags: ['xyz'] },
      { title: 'c', tags: ['a', 'b', 'xyz'] },
      { title: 'd', tags: [] },
      { title: 'e', tags: ['xyz', 'b'] },
    ]);
    expect(loadPostsByTag(context, 'xyz')).toEqual({
      items: [
        {
          items: [
            { title: 'b', tags: ['xyz'] },
            { title: 'c', tags: ['a', 'b', 'xyz'] },
          ],
          link: '/x/tags/xyz/page-1.html',
        },
        {
          items: [{ title: 'e', tags: ['xyz', 'b'] }],
          link: '/x/tags/xyz/page-2.html',
        },
      ],
      title: 'Tag xyz',
    });

    expect(loadPosts).toHaveBeenCalledTimes(1);
    expect(loadPosts).toHaveBeenCalledWith(context);
  });

  it('loadTags', () => {
    loadPosts.mockImplementation(() => [
      { title: 'a', tags: ['a', 'b'] },
      { title: 'b', tags: ['xyz'] },
      { title: 'c', tags: ['a', 'b', 'xyz'] },
      { title: 'd', tags: [] },
      { title: 'e', tags: ['xyz', 'b'] },
    ]);
    expect(loadTags(context)).toEqual(['a', 'b', 'xyz']);

    expect(loadPosts).toHaveBeenCalledTimes(1);
    expect(loadPosts).toHaveBeenCalledWith(context);
  });

  it('loadDates', () => {
    loadPosts.mockImplementation(() => [
      { title: 'a', date: new Date('2020-02-03T10:00:00') },
      { title: 'b', date: new Date('2019-02-03T10:00:00') },
      { title: 'c', date: new Date('2019-01-01T10:00:00') },
      { title: 'd', date: new Date('2019-01-02T10:00:00') },
      { title: 'e', date: new Date('2019-01-03T10:00:00') },
    ]);
    expect(loadDates(context)).toEqual([
      { year: 2020, month: 2 },
      { year: 2019, month: 2 },
      { year: 2019, month: 1 },
    ]);

    expect(loadPosts).toHaveBeenCalledTimes(1);
    expect(loadPosts).toHaveBeenCalledWith(context);
  });
});
