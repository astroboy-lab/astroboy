'use strict';
const glob = require('fast-glob');
const Loader = require('../core/Loader');

class AstroboyControllerLoader extends Loader {
  load() {
    const app = this.app;
    let controllers = {};
    const entries = glob.sync([`${app.ROOT_PATH}${this.config.pattern}`], {
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
