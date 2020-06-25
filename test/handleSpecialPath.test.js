const handleSpecialPath = require('../src/handleSpecialPath');
const {
  loadAllPosts,
  loadPostsByDate,
  loadPostsByTag,
} = require('../src/loadPostsFunctions');

jest.mock('../src/loadPostsFunctions');

const pageSize = 2;
const postsPath = 'a/b/c';

describe('handleSpecialPath', () => {
  beforeEach(() => {
    loadAllPosts.mockClear();
    loadPostsByDate.mockClear();
    loadPostsByTag.mockClear();
  });

  it('index', () => {
    loadAllPosts.mockImplementation(() => [['a', 'b'], ['c']]);

    expect(handleSpecialPath('/', postsPath, pageSize)).toEqual({
      type: 'html',
      pages: ['a', 'b'],
      nextPageUrl: '/posts/page-2.html',
      pageNumber: 1,
      pathName: '/',
      title: 'Posts',
    });

    expect(loadAllPosts).toHaveBeenCalledTimes(1);
    expect(loadAllPosts).toHaveBeenCalledWith(postsPath, pageSize);
  });

  it('pages - page 2', () => {
    loadAllPosts.mockImplementation(() => [['a', 'b'], ['c']]);

    expect(
      handleSpecialPath('/posts/page-2.html', postsPath, pageSize)
    ).toEqual({
      type: 'html',
      pages: ['c'],
      pageTitle: 'Posts - Page 2',
      title: 'Posts',
      previousPageUrl: '/',
      pageNumber: 2,
      pathName: '/posts/page-2.html',
    });

    expect(loadAllPosts).toHaveBeenCalledTimes(1);
    expect(loadAllPosts).toHaveBeenCalledWith(postsPath, pageSize);
  });

  it('pages - page 3', () => {
    loadAllPosts.mockImplementation(() => [['a', 'b'], ['c']]);

    expect(
      handleSpecialPath('/posts/page-3.html', postsPath, pageSize)
    ).toEqual({
      type: '404',
    });

    expect(loadAllPosts).toHaveBeenCalledTimes(1);
    expect(loadAllPosts).toHaveBeenCalledWith(postsPath, pageSize);
  });

  it('tags - page 1', () => {
    loadPostsByTag.mockImplementation(() => [['a', 'b'], ['c']]);

    expect(
      handleSpecialPath('/tags/Hello%20world/page-1.html', postsPath, pageSize)
    ).toEqual({
      type: 'html',
      pages: ['a', 'b'],
      title: 'Tag Hello world',
      pageTitle: 'Tag Hello world - Page 1',
      nextPageUrl: '/tags/Hello%20world/page-2.html',
      pageNumber: 1,
      pathName: '/tags/Hello%20world/page-1.html',
    });
  });

  it('tags - page 2', () => {
    loadPostsByTag.mockImplementation(() => [['a', 'b'], ['c']]);

    expect(
      handleSpecialPath('/tags/Hello%20world/page-2.html', postsPath, pageSize)
    ).toEqual({
      type: 'html',
      pages: ['c'],
      title: 'Tag Hello world',
      pageTitle: 'Tag Hello world - Page 2',
      previousPageUrl: '/tags/Hello%20world/page-1.html',
      pageNumber: 2,
      pathName: '/tags/Hello%20world/page-2.html',
    });
  });

  it('tags - page 3', () => {
    loadPostsByTag.mockImplementation(() => [['a', 'b'], ['c']]);

    expect(
      handleSpecialPath('/tags/Hello%20world/page-3.html', postsPath, pageSize)
    ).toEqual({
      type: '404',
    });
  });

  it('archive - page 1', () => {
    loadPostsByDate.mockImplementation(() => [['a', 'b'], ['c']]);

    expect(
      handleSpecialPath('/archive/2020-01/page-1.html', postsPath, pageSize)
    ).toEqual({
      type: 'html',
      pages: ['a', 'b'],
      pageTitle: 'Archive January 2020 - Page 1',
      title: 'Archive January 2020',
      nextPageUrl: '/archive/2020-01/page-2.html',
      pageNumber: 1,
      pathName: '/archive/2020-01/page-1.html',
    });
  });

  it('archive - page 2', () => {
    loadPostsByDate.mockImplementation(() => [['a', 'b'], ['c']]);

    expect(
      handleSpecialPath('/archive/2020-01/page-2.html', postsPath, pageSize)
    ).toEqual({
      type: 'html',
      pages: ['c'],
      pageTitle: 'Archive January 2020 - Page 2',
      title: 'Archive January 2020',
      previousPageUrl: '/archive/2020-01/page-1.html',
      pageNumber: 2,
      pathName: '/archive/2020-01/page-2.html',
    });
  });

  it('archive - page 3', () => {
    loadPostsByDate.mockImplementation(() => [['a', 'b'], ['c']]);

    expect(
      handleSpecialPath('/archive/2020-01/page-3.html', postsPath, pageSize)
    ).toEqual({
      type: '404',
    });
  });

  it('404', () => {
    expect(handleSpecialPath('/a/b/c', postsPath, pageSize)).toEqual({
      type: '404',
    });
  });
});
