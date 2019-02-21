'use strict';
const fs = require('fs-extra');
const Loader = require('../core/Loader');

class AstroboyServiceLoader extends Loader {
  load() {
    let services = {};
    this.dirs.forEach(item => {
      const indexFile = `${item.baseDir}/app/services/index.js`;
      if (fs.existsSync(indexFile)) {
        services[item.name] = require(indexFile);
      } else {
        this.globDir(item.baseDir, this.config.pattern, entries => {
          if (entries.length > 0) {
            services[item.name] = {};
            entries.forEach(entry => {
              const key = this.resolveExtensions(entry.split('services/')[1], true);
              services[item.name][key] = require(entry);
            });
          }
        });
      }
    });
    this.app.services = services;
  }
}

module.exports = AstroboyServiceLoader;
