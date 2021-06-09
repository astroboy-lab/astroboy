import * as fs from 'fs';
import { Loader } from '../core/Loader';
import { IInnerApplication, PureObject } from '../definitions/core';
import { IOptions } from '../definitions/config';

class AstroboyServiceLoader extends Loader<Partial<IOptions>, IInnerApplication<Partial<IOptions>>> {
  async load() {
    let services: PureObject = {};

    for (const item of this.dirs) {
      const indexFile = `${item.baseDir}/app/services/index.js`;
      if (fs.existsSync(indexFile)) {
        services[item.name] = require(indexFile);
      } else {
        const entries = await this.globDir(item.baseDir, this.config.pattern || []);
        if (entries.length > 0) {
          services[item.name] = {};
          (<string[]>entries).forEach(entry => {
            const key = this.resolveExtensions(entry.split('services/')[1], true);
            services[item.name][key] = require(entry);
          });
        }
       
      }
    }

    this.app.services = services;
  }
}

export = AstroboyServiceLoader;
