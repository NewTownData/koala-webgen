const configurationSchema = require('../../src/validation/configurationSchema');

const exampleConfiguration = {
  theme: 'default',
  title: 'Koala',
  subtitle: 'Static Website Generator',
  description: 'A simple static website generator',
  keywords: ['test'],
  url: 'https://www.example.com',
  websitePath: '/',
  menu: [
    {
      name: 'About',
      link: '/about.html',
    },
  ],
  dateFormat: 'd MMMM yyyy',
  pageSize: 5,
  feedSize: 10,
};

describe('configurationSchema', () => {
  it('validates', () => {
    expect(
      configurationSchema.validate(exampleConfiguration).error
    ).toBeUndefined();
  });

  it('fails', () => {
    Object.keys(exampleConfiguration).forEach((key) => {
      const configuration = { ...exampleConfiguration };
      configuration[key] = undefined;
      expect(
        configurationSchema.validate(configuration).error
      ).not.toBeUndefined();
    });
  });

  it('empty fails', () => {
    expect(configurationSchema.validate().error).not.toBeUndefined();
  });
});
