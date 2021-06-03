import * as assert from 'assert';
import * as lodash from 'lodash';
import { Loader } from '../core/Loader';
import { IInnerApplication } from '../definitions/core';
import { IOptions } from '../definitions/config';
import { isAsyncFunction } from '../core/lib/util';

class AstroboyBootLoader extends Loader<Partial<IOptions>, IInnerApplication<Partial<IOptions>>> {
  async load() {
    await this.globDirs(this.config.pattern || [], async entries => {
      for (const entry of entries) {
        const boot = require(entry as string);
        assert(lodash.isFunction(boot), `${entry} must return a function.`);
        if (isAsyncFunction(boot)) {
          await boot(this.app);
        } else {
          boot(this.app);
        }
      }
    });
  }
}

export = AstroboyBootLoader;
