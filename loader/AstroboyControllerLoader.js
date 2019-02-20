'use strict';
const glob = require('fast-glob');
const Loader = require('../core/Loader');

class AstroboyControllerLoader extends Loader {
  load(dirs, options = {}, app) {
    let controllers = {};
    const entries = glob.sync([`${app.ROOT_PATH}${options.pattern}`], {
      dot: true,
    });
    entries
      .filter(i => !i.includes('.d.ts'))
      .forEach(entry => {
        const key = this.resolveExtensions(entry.split('controllers/')[1], true);
        controllers[key] = require(entry);
      });
    app.controllers = controllers;
  }
}

module.exports = AstroboyControllerLoader;
