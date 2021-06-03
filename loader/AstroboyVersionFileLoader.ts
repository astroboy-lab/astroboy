import * as glob from 'fast-glob';
import * as path from 'path';
import { Loader } from '../core/Loader';
import { IInnerApplication, PureObject } from '../definitions/core';
import { IOptions } from '../definitions/config';

class AstroboyVersionFileLoader extends Loader<Partial<IOptions>, IInnerApplication<Partial<IOptions>>> {
  async load() {
    let versionMap: PureObject = {};

    for (const item of this.dirs) {
      const entries = await glob([`${item.baseDir}${this.config.pattern}`], {
        dot: true,
      });
      entries.forEach(entry => {
        const key = path.basename(entry as string, '.json');
        versionMap[key] = require(entry as string);
      });
    }

    this.app.versionMap = versionMap;
  }
}

export = AstroboyVersionFileLoader;
