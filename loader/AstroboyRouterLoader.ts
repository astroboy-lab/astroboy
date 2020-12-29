import * as fs from 'fs';
import * as glob from 'fast-glob';
// @ts-ignore typings missing
import * as methods from 'methods';
import { Loader } from '../core/Loader';
import { IInnerApplication } from '../definitions/core';
import { IOptions } from '../definitions/config';

class AstroboyRouterLoader extends Loader<Partial<IOptions>, IInnerApplication<Partial<IOptions>>> {
  load() {
    let routers: any[] = [];
    const indexFile = `${this.app.ROOT_PATH}/app/routers/index.js`;
    if (fs.existsSync(indexFile)) {
      routers = require(indexFile);
    } else {
      const entries = glob.sync([`${this.app.ROOT_PATH}${this.config.pattern}`], {
        dot: true,
      });
      entries.forEach(entry => {
        routers = routers.concat(require(entry as string));
      });
    }

    const controllers = this.app.controllers;
    let newRouters: any[] = [];
    routers.forEach(router => {
      // 如果第一个参数不是 routerName，则添加空参数名
      if (methods.indexOf(router[0].toLowerCase()) > -1) {
        router.unshift('');
      }
      newRouters.push({
        name: router[0],
        verb: router[1].toLowerCase(),
        path: Array.isArray(router[2]) ? router[2] : [router[2]],
        controller: controllers[router[3]],
        methods: Array.isArray(router[4]) ? router[4] : [router[4]],
        controllerName: router[3],
      });
    });
    this.app.routers = newRouters;
  }
}

export = AstroboyRouterLoader;
