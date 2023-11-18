const extractDescription = require('../../src/feed/extractDescription');

describe('extractDescription', () => {
  it('works', () => {
    expect(extractDescription('')).toBe('');
    expect(extractDescription('Test \nmessage')).toBe('Test message');
    expect(extractDescription('<b>Test</b><p>message</p>')).toBe(
      'Test message',
    );
  });
});
