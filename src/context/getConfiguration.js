const path = require('path');
const { loadTextFile } = require('../files');
const configurationSchema = require('../validation/configurationSchema');

function getConfiguration(websiteRoot) {
  try {
    const configurationFile = path.resolve(websiteRoot, 'configuration.json');
    const configuration = JSON.parse(loadTextFile(configurationFile));

    const validationResult = configurationSchema.validate(configuration);
    if (validationResult.error) {
      throw new Error(validationResult.error);
    }

    return configuration;
  } catch (e) {
    throw new Error(
      `Failed to load configuration for ${websiteRoot}: ${e.message}`,
    );
  }
}

module.exports = getConfiguration;
