import * as assert from 'assert';
import * as lodash from 'lodash';
import { Loader } from '../core/Loader';
import { IInnerApplication } from '../definitions/core';
import { IOptions } from '../definitions/config';

class AstroboyBootLoader extends Loader<Partial<IOptions>, IInnerApplication<Partial<IOptions>>> {
  async load() {
    const entries = await this.globDirs(this.config.pattern || []);
    for (const entry of entries) {
      const boot = require(entry as string);
      assert(lodash.isFunction(boot), `${entry} must return a function.`);
      await boot(this.app);
    }
  }
}

export = AstroboyBootLoader;
