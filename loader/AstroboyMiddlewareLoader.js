'use strict';
const lodash = require('lodash');
const Loader = require('../core/Loader');

class AstroboyMiddlewareLoader extends Loader {
  load() {
    let config = {};
    this.globDirs(this.config.configPattern, entries => {
      entries.forEach(entry => {
        config = lodash.merge(config, require(entry));
      });
    });
    this.app.middlewareConfig = config;
  }
}

module.exports = AstroboyMiddlewareLoader;
