const responseSchema = require('../../src/validation/responseSchema');

const exampleResponse = {
  type: 'file',
  headers: { 'Content-Type': 'text/html', Location: '/' },
  payload: '<html></html>',
};

describe('contextSchema', () => {
  it('file validates', () => {
    expect(responseSchema.validate(exampleResponse).error).toBeUndefined();
  });

  it('404 validates', () => {
    expect(responseSchema.validate({ type: '404' }).error).toBeUndefined();
  });

  it('fails', () => {
    expect(
      responseSchema.validate({ ...exampleResponse, type: undefined }).error,
    ).not.toBeUndefined();
  });

  it('empty fails', () => {
    expect(responseSchema.validate().error).not.toBeUndefined();
  });
});
