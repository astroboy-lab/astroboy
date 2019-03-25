'use strict';
const glob = require('fast-glob');
const path = require('path');
const Loader = require('../core/Loader');

class AstroboyVersionFileLoader extends Loader {
  load() {
    let versionMap = {};

    this.dirs.forEach(item => {
      const entries = glob.sync([`${item.baseDir}${this.config.pattern}`], {
        dot: true,
      });
      entries.forEach(entry => {
        const key = path.basename(entry, '.json');
        versionMap[key] = require(entry);
      });
    });

    this.app.versionMap = versionMap;
  }
}

module.exports = AstroboyVersionFileLoader;
