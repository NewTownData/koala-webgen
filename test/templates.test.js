const path = require('path');
const Handlebars = require('handlebars');
const { initTemplates, createTemplate } = require('../src/templates');
const loadTextFile = require('../src/loadTextFile');

const themePath = path.join(__dirname, 'resources', 'test_theme');

describe('templates', () => {
  describe('default config', () => {
    beforeAll(() => {
      initTemplates({}, themePath);
    });

    it('include', () => {
      const template = Handlebars.compile(
        loadTextFile(path.join(themePath, 'index.html'))
      );
      expect(template({ test: 'world' })).toBe(
        '<b>Hello world</b>\n<b>Bye world</b>'
      );
    });

    it('printDate', () => {
      const template = Handlebars.compile('{{printDate date}}');
      expect(template({ date: new Date(2020, 0, 20, 12, 0, 0) })).toBe(
        '2020-01-20'
      );
    });

    it('createTemplate', () => {
      const template = createTemplate(path.join(themePath, 'index.html'));
      expect(template({ test: 'world' })).toBe(
        '<b>Hello world</b>\n<b>Bye world</b>'
      );
    });
  });

  describe('with config', () => {
    beforeAll(() => {
      initTemplates({ dateFormat: 'd MMMM yyyy' }, themePath);
    });

    it('printDate', () => {
      const template = Handlebars.compile('{{printDate date}}');
      expect(template({ date: new Date(2020, 0, 20, 12, 0, 0) })).toBe(
        '20 January 2020'
      );
    });
  });
});
