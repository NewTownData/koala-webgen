#!/usr/bin/env node
const path = require('path');
const startServer = require('../src/startServer');
const build = require('../src/build');
const init = require('../src/init');

const validArguments = ['start', 'build', 'init'];

const cwd = process.cwd();
const websiteRoot = path.resolve(cwd, 'website');
const destination = path.resolve(cwd, 'dist');

const port = 3080;

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error(
    `No argument specified. Valid arguments: ${validArguments.reduce((p, c) =>
      p ? `${p}, ${c}` : c
    )}`
  );
  process.exit(1);
}

const command = args[0];
switch (command) {
  case 'start':
    console.log('Starting server...');
    startServer(websiteRoot, port);
    break;
  case 'build':
    console.log('Running build...');
    build(websiteRoot, destination);
    break;
  case 'init':
    console.log('Creating folder structure...');
    init(path.resolve(cwd, 'website2'));
    break;
  default:
    console.error(
      `Invalid argument '${command}' specified. Valid arguments: ${validArguments.reduce(
        (prev, current) => (prev ? `${prev}, ${current}` : current)
      )}`
    );
    process.exit(1);
}
