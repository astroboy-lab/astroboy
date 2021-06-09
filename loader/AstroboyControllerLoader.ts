import * as glob from 'fast-glob';
import { Loader } from '../core/Loader';
import { IInnerApplication, PureObject } from '../definitions/core';
import { IOptions } from '../definitions/config';

class AstroboyControllerLoader extends Loader<Partial<IOptions>, IInnerApplication<Partial<IOptions>>> {
  async load() {
    const app = this.app;
    let controllers: PureObject = {};
    const entries = await glob([`${app.ROOT_PATH}${this.config.pattern}`], {
      dot: true,
    });
    (<string[]>entries)
      .filter(i => !i.includes('.d.ts'))
      .forEach(entry => {
        const key = this.resolveExtensions(entry.split('controllers/')[1], true);
        controllers[key] = require(entry);
      });
    app.controllers = controllers;
  }
}

export = AstroboyControllerLoader;
