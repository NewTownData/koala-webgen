const path = require('path');
const startServer = require('../src/startServer');

const cwd = process.cwd();
const websiteRoot = path.resolve(cwd, 'website');

const port = 3080;

startServer(websiteRoot, port);
