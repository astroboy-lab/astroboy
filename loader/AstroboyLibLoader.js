'use strict';
const fs = require('fs');
const Loader = require('../core/Loader');

class AstroboyLibLoader extends Loader {
  load() {
    let libs = {};
    this.dirs.forEach(item => {
      const indexFile = `${item.baseDir}/app/lib/index.js`;
      if (fs.existsSync(indexFile)) {
        libs[item.name] = require(indexFile);
      } else {
        this.globDir(item.baseDir, this.config.pattern, entries => {
          if (entries.length > 0) {
            libs[item.name] = {};
            entries.forEach(entry => {
              const key = this.resolveExtensions(entry.split('lib/')[1], true);
              libs[item.name][key] = require(entry);
            });
          }
        });
      }
    });

    this.app.libs = libs;
  }
}

module.exports = AstroboyLibLoader;
