import * as fs from 'fs';
import { Loader } from '../core/Loader';
import { IInnerApplication, PureObject } from '../definitions/core';
import { IOptions } from '../definitions/config';

class AstroboyLibLoader extends Loader<Partial<IOptions>, IInnerApplication<Partial<IOptions>>> {
  async load() {
    let libs: PureObject = {};

    for (const item of this.dirs) {
      try {
        const indexFile = require.resolve(`${item.baseDir}/app/lib/index`);
        libs[item.name] = require(indexFile);
      } catch (_err) {
        const entries = await this.globDir(item.baseDir, this.config.pattern || []);
        if (entries.length > 0) {
          libs[item.name] = {};
          entries.forEach(entry => {
            const key = this.resolveExtensions((<string>entry).split('lib/')[1], true);
            libs[item.name][key] = require(entry as string);
          });
        }
      }
    }

    this.app.libs = libs;
  }
}

export = AstroboyLibLoader;
