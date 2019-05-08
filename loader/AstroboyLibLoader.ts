import * as fs from 'fs';
import { Loader } from '../core/Loader';
import { IInnerApplication, PureObject } from '../definitions/core';
import { IOptions } from '../definitions/config';

class AstroboyLibLoader extends Loader<Partial<IOptions>, IInnerApplication<Partial<IOptions>>> {
  load() {
    let libs: PureObject = {};
    this.dirs.forEach(item => {
      const indexFile = `${item.baseDir}/app/lib/index.js`;
      if (fs.existsSync(indexFile)) {
        libs[item.name] = require(indexFile);
      } else {
        this.globDir(item.baseDir, this.config.pattern || [], entries => {
          if (entries.length > 0) {
            libs[item.name] = {};
            entries.forEach(entry => {
              const key = this.resolveExtensions((<string>entry).split('lib/')[1], true);
              libs[item.name][key] = require(entry as string);
            });
          }
        });
      }
    });

    this.app.libs = libs;
  }
}

export = AstroboyLibLoader;
