const Handlebars = require('handlebars');
const path = require('path');
const { format } = require('date-fns');
const loadTextFile = require('./loadTextFile');

function initTemplates(configuration, themePath) {
  Handlebars.registerHelper('include', function (source) {
    const includeContent = loadTextFile(
      path.join(themePath, 'components', `${source}.html`)
    );
    const template = Handlebars.compile(includeContent);
    return template(this);
  });

  Handlebars.registerHelper('printDate', function (source) {
    const { dateFormat } = configuration;
    return format(source, dateFormat || 'yyyy-MM-dd');
  });
}

function createTemplate(filePath) {
  return Handlebars.compile(loadTextFile(filePath));
}

module.exports = { initTemplates, createTemplate };
