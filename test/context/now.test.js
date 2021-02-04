const now = require('../../src/context/now');

const TestDate = new Date(Date.UTC(2020, 11, 1, 14, 10, 20));

describe('now', () => {
  let dateNowMock;

  beforeEach(() => {
    dateNowMock = jest.spyOn(global, 'Date').mockImplementation(() => TestDate);
  });

  afterEach(() => {
    dateNowMock.mockRestore();
  });

  it('valid', () => {
    expect(now()).toEqual(TestDate);
  });
});
