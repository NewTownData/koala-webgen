const loadPosts = require('../src/loadPosts');
const {
  loadAllPosts,
  loadPostsByDate,
  loadPostsByTag,
  loadTags,
  loadDates,
} = require('../src/loadPostsFunctions');

jest.mock('../src/loadPosts');

const postsPath = 'a/b/c';

describe('loadPosts', () => {
  beforeEach(() => {
    loadPosts.mockClear();
  });

  it('loadAllPosts', () => {
    loadPosts.mockImplementation(() => ['a', 'b', 'c']);
    expect(loadAllPosts(postsPath, 2)).toEqual([['a', 'b'], ['c']]);

    expect(loadPosts).toHaveBeenCalledTimes(1);
    expect(loadPosts).toHaveBeenCalledWith(postsPath);
  });

  it('loadPostsByDate 2019-01', () => {
    loadPosts.mockImplementation(() => [
      { title: 'a', date: new Date('2020-02-03T10:00:00') },
      { title: 'b', date: new Date('2019-02-03T10:00:00') },
      { title: 'c', date: new Date('2019-01-01T10:00:00') },
      { title: 'd', date: new Date('2019-01-02T10:00:00') },
      { title: 'e', date: new Date('2019-01-03T10:00:00') },
    ]);
    expect(loadPostsByDate(postsPath, 2, 2019, 1)).toEqual([
      [
        { title: 'c', date: new Date('2019-01-01T10:00:00') },
        { title: 'd', date: new Date('2019-01-02T10:00:00') },
      ],
      [{ title: 'e', date: new Date('2019-01-03T10:00:00') }],
    ]);

    expect(loadPosts).toHaveBeenCalledTimes(1);
    expect(loadPosts).toHaveBeenCalledWith(postsPath);
  });

  it('loadPostsByTag xyz', () => {
    loadPosts.mockImplementation(() => [
      { title: 'a', tags: ['a', 'b'] },
      { title: 'b', tags: ['xyz'] },
      { title: 'c', tags: ['a', 'b', 'xyz'] },
      { title: 'd', tags: [] },
      { title: 'e', tags: ['xyz', 'b'] },
    ]);
    expect(loadPostsByTag(postsPath, 2, 'xyz')).toEqual([
      [
        { title: 'b', tags: ['xyz'] },
        { title: 'c', tags: ['a', 'b', 'xyz'] },
      ],
      [{ title: 'e', tags: ['xyz', 'b'] }],
    ]);

    expect(loadPosts).toHaveBeenCalledTimes(1);
    expect(loadPosts).toHaveBeenCalledWith(postsPath);
  });

  it('loadTags', () => {
    loadPosts.mockImplementation(() => [
      { title: 'a', tags: ['a', 'b'] },
      { title: 'b', tags: ['xyz'] },
      { title: 'c', tags: ['a', 'b', 'xyz'] },
      { title: 'd', tags: [] },
      { title: 'e', tags: ['xyz', 'b'] },
    ]);
    expect(loadTags(postsPath)).toEqual(['a', 'b', 'xyz']);

    expect(loadPosts).toHaveBeenCalledTimes(1);
    expect(loadPosts).toHaveBeenCalledWith(postsPath);
  });

  it('loadDates', () => {
    loadPosts.mockImplementation(() => [
      { title: 'a', date: new Date('2020-02-03T10:00:00') },
      { title: 'b', date: new Date('2019-02-03T10:00:00') },
      { title: 'c', date: new Date('2019-01-01T10:00:00') },
      { title: 'd', date: new Date('2019-01-02T10:00:00') },
      { title: 'e', date: new Date('2019-01-03T10:00:00') },
    ]);
    expect(loadDates(postsPath)).toEqual([
      { year: 2020, month: 2 },
      { year: 2019, month: 2 },
      { year: 2019, month: 1 },
    ]);

    expect(loadPosts).toHaveBeenCalledTimes(1);
    expect(loadPosts).toHaveBeenCalledWith(postsPath);
  });
});
