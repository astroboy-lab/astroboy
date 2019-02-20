'use strict';
const path = require('path');
const fs = require('fs');
const Loader = require('../core/Loader');

class AstroboyPkgLoader extends Loader {
  load(dirs, options = {}, app) {
    const pkgPath = path.resolve(__dirname, '../package.json');

    if (fs.existsSync(pkgPath)) {
      app.pkg = require(pkgPath);
    }
  }
}

module.exports = AstroboyPkgLoader;
