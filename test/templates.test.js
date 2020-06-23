const path = require('path');
const Handlebars = require('handlebars');
const { initTemplates, createTemplate } = require('../src/templates');
const loadTextFile = require('../src/loadTextFile');

const themePath = path.join(__dirname, 'resources', 'test_theme');

describe('templates', () => {
  beforeAll(() => {
    initTemplates(themePath);
  });

  it('initTemplates works', () => {
    const template = Handlebars.compile(
      loadTextFile(path.join(themePath, 'index.html'))
    );
    expect(template({ test: 'world' })).toBe(
      '<b>Hello world</b>\n<b>Bye world</b>'
    );
  });

  it('createTemplate works', () => {
    const template = createTemplate(path.join(themePath, 'index.html'));
    expect(template({ test: 'world' })).toBe(
      '<b>Hello world</b>\n<b>Bye world</b>'
    );
  });
});
