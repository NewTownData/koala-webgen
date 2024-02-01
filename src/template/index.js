const Handlebars = require('handlebars');
const path = require('path');
const { format } = require('date-fns');
const { loadTextFile } = require('../files');
const pageSchema = require('../validation/pageSchema');

function executeTemplate(context, pageContext) {
  const { configuration, paths } = context;
  const { dateFormat } = configuration;
  const { theme: themePath } = paths;

  const pageValidationResult = pageSchema.validate(pageContext);
  if (pageValidationResult.error) {
    throw new Error(`Invalid page context: ${pageValidationResult.error}`);
  }

  const options = {
    helpers: {
      include: (source) => {
        const includeContent = loadTextFile(
          path.join(themePath, 'components', `${source}.html`),
        );
        const includeTemplate = Handlebars.compile(includeContent);
        return includeTemplate(pageContext, options);
      },
      printDate: (source) => {
        try {
          return format(source, dateFormat || 'yyyy-MM-dd');
        } catch (e) {
          throw new Error(`Cannot print date ${source}: ${e.message}`);
        }
      },
      equals: (left, right) => left === right,
      not: (source) => !source,
    },
  };

  const template = Handlebars.compile(
    loadTextFile(path.join(themePath, 'index.html')),
  );
  return template(pageContext, options);
}

module.exports = { executeTemplate };
