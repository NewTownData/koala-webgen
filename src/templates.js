const Handlebars = require('handlebars');
const path = require('path');
const loadTextFile = require('./loadTextFile');

function initTemplates(themePath) {
  Handlebars.registerHelper('include', function (source) {
    const includeContent = loadTextFile(
      path.join(themePath, 'components', `${source}.html`)
    );
    const template = Handlebars.compile(includeContent);
    return template(this);
  });
}

function createTemplate(filePath) {
  return Handlebars.compile(loadTextFile(filePath));
}

module.exports = { initTemplates, createTemplate };
