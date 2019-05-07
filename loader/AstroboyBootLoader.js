'use strict';
const lodash = require('lodash');
const assert = require('assert');
const Loader = require('../core/Loader');

class AstroboyBootLoader extends Loader {
  load() {
    this.globDirs(this.config.pattern, entries => {
      entries.forEach(entry => {
        let boot = require(entry);
        assert(lodash.isFunction(boot), `${entry} must return a function.`);
        boot(this.app);
      });
    });
  }
}

module.exports = AstroboyBootLoader;
