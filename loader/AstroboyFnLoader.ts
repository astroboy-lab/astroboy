import { Loader } from '../core/Loader';
import { IInnerApplication, PureObject } from '../definitions/core';
import { IOptions } from '../definitions/config';

class AstroboyFnLoader extends Loader<Partial<IOptions>, IInnerApplication<Partial<IOptions>>> {
  load() {
    let fns: PureObject = {};

    this.dirs.forEach(item => {
      this.globDir(item.baseDir, this.config.pattern || [], entries => {
        if (entries.length > 0) {
          (<string[]>entries).forEach(entry => {
            const key = this.resolveExtensions(entry.split('fns/')[1], true);
            fns[key] = require(entry);
          });
        }
      });
    });
    this.app.fns = fns;
  }
}

export = AstroboyFnLoader;
