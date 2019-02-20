'use strict';
const glob = require('fast-glob');
const path = require('path');
const Loader = require('../core/Loader');

class AstroboyVersionFileLoader extends Loader {
  load(dirs, options = {}, app) {
    let versionMap = {};

    dirs.forEach(item => {
      const entries = glob.sync([`${item.baseDir}${options.pattern}`], {
        dot: true,
      });
      entries.forEach(entry => {
        const key = path.basename(entry, '.json');
        versionMap[key] = require(entry);
      });
    });

    app.versionMap = versionMap;
  }
}

module.exports = AstroboyVersionFileLoader;
