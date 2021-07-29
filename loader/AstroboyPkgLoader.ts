import * as path from 'path';
import * as fs from 'fs';
import { Loader } from '../core/Loader';
import { IInnerApplication } from '../definitions/core';
import { IOptions } from '../definitions/config';

class AstroboyPkgLoader extends Loader<Partial<IOptions>, IInnerApplication<Partial<IOptions>>> {
  async load() {
    const pkgPath = path.resolve(__dirname, '../package.json');

    if (fs.existsSync(pkgPath)) {
      this.app.pkg = require(pkgPath);
    }
  }
}

export = AstroboyPkgLoader;
