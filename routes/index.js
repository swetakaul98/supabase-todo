/**
 * All Routes
 */
const path = require('path');
const fs = require('fs');

const routes = (app) => {
  fs.readdirSync(__dirname)
    .filter((file) => (file.indexOf('.') !== 0) && (file !== path.basename(__filename)) && (file.slice(-3) === '.js'))
    .forEach((file) => {
      // eslint-disable-next-line import/no-dynamic-require, global-require
      const route = require(path.join(__dirname, file));
      route(app);
    });
};

module.exports = routes;
