import * as fs from 'fs-extra';
import * as glob from 'fast-glob';
import * as lodash from 'lodash';
// @ts-ignore typings missing
import * as methods from 'methods';
import { Loader } from '../core/Loader';
import { IInnerApplication } from '../definitions/core';
import { IOptions } from '../definitions/config';
import { IConstructor } from '../definitions';

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
      if (Array.isArray(router)) {
        // 如果第一个参数不是 routerName，则添加空参数名
        if (methods.indexOf(router[0].toLowerCase()) > -1) {
          router.unshift('');
        }
        newRouters.push({
          version: 'v1',
          name: router[0],
          method: router[1].toLowerCase(),
          path: Array.isArray(router[2]) ? router[2] : [router[2]],
          controllerClass: controllers[router[3]],
          controllerMethod: Array.isArray(router[4]) ? router[4] : [router[4]],
          controllerName: router[3],
        });
      } else {
        newRouters.push({
          version: 'v2',
          name: router.name || '',
          method: router.method.toLowerCase(),
          path: Array.isArray(router.path) ? router.path : [router.path],
          controllerClass: controllers[router.controllerName],
          controllerMethod: Array.isArray(router.controllerMethod)
            ? router.controllerMethod
            : [router.controllerMethod],
          controllerName: router.controllerName,
        });
      }
    });
    newRouters.forEach(item => {
      const ControllerClass: IConstructor<any> = item.controllerClass;
      if (!ControllerClass) {
        throw new Error(`注册路由失败，控制器类 ${item.controllerName} 不存在`);
      }
      if (!lodash.isFunction(ControllerClass)) {
        throw new Error(`注册路由失败，控制器类 ${item.controllerName} 必须为一个 class`);
      }
      for (let i = 0; i < item.controllerMethod.length; i++) {
        if (!ControllerClass.prototype[item.controllerMethod[i]]) {
          throw new Error(
            `注册路由失败，控制器类 ${item.controllerName} 不存在方法名为 ${item.controllerMethod[i]} 的方法`
          );
        }
      }
    });
    this.app.routers = newRouters;
  }
}

export = AstroboyRouterLoader;
