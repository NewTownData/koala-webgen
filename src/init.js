const fs = require('fs');
const path = require('path');

function copy(fromPath, toPath) {
  console.debug(`Copying ${fromPath} to ${toPath}`);
  const files = fs.readdirSync(fromPath, {
    encoding: 'utf-8',
    withFileTypes: true,
  });

  fs.mkdirSync(toPath);

  files
    .filter((f) => f.isFile())
    .forEach((f) =>
      fs.copyFileSync(path.join(fromPath, f.name), path.join(toPath, f.name))
    );

  files
    .filter((f) => f.isDirectory())
    .forEach((f) => {
      copy(path.join(fromPath, f.name), path.join(toPath, f.name));
    });
}

function init(websiteRoot) {
  console.log(`Creating folder structure at ${websiteRoot} ...`);
  const sourcePath = path.join(__dirname, '..', 'website');

  if (fs.existsSync(websiteRoot)) {
    console.error('Destination already exists.');
    return;
  }

  copy(sourcePath, websiteRoot);
}

module.exports = init;
