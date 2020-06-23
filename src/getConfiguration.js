const path = require('path');
const loadTextFile = require('./loadTextFile');

function getConfiguration(websiteRoot) {
  const configuration = path.resolve(websiteRoot, 'configuration.json');
  const config = JSON.parse(loadTextFile(configuration));
  return config;
}

module.exports = getConfiguration;
