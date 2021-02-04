import * as fs from 'fs';
import * as glob from 'fast-glob';
import { METHODS } from 'http';
import * as lodash from 'lodash';
import { Loader } from '../core/Loader';
import { IInnerApplication } from '../definitions/core';
import { IOptions } from '../definitions/config';

const Ajv = require('ajv');
const ajv = new Ajv();

function check(data: any) {
  return Object.prototype.toString.call(data) === '[object Object]' && Object.keys(data).length > 0;
}

/**
 * 加载所有路由文件
 */
function loadRouters(rootPath: string, pattern: any): any[] {
  let routerArr: any[] = [];
  const indexFile = `${rootPath}/app/routers/index.js`;
  if (fs.existsSync(indexFile)) {
    const content = require(indexFile);
    if (Array.isArray(content)) {
      routerArr = content;
    }
  } else {
    const entries = glob.sync([`${rootPath}${pattern}`], {
      dot: true,
    });
    entries.forEach(entry => {
      routerArr = routerArr.concat(require(entry as string));
    });
  }
  return routerArr;
}

/**
 * 解析老的路由写法
 */
function parseOldRouter(router: any): any {
  // 如果第一个参数不是 routerName，则添加空参数名
  if (METHODS.indexOf(router[0].toUpperCase()) > -1) {
    router.unshift('');
  }
  return {
    name: router[0],
    description: '',
    method: Array.isArray(router[1]) ? router[1] : [router[1]],
    path: Array.isArray(router[2]) ? router[2] : [router[2]],
    controllerName: router[3],
    controllerMethods: Array.isArray(router[4]) ? router[4] : [router[4]],
    schema: {},
  };
}

/**
 * 解析新的路由写法
 */
function parseNewRouter(router: any): any {
  const controllerMethods = router.preHandler || [];
  if (!router.handler) {
    throw new Error(`注册路由失败，handler 不能为空`);
  }
  const splitArr = router.handler.split(':');
  controllerMethods.push(splitArr[1]);

  if (!router.method) {
    throw new Error(`注册路由失败，method 不能为空`);
  }
  if (!router.path) {
    throw new Error(`注册路由失败，path 不能为空`);
  }

  return {
    name: router.name,
    description: router.description || '',
    method: Array.isArray(router.method) ? router.method : [router.method],
    path: Array.isArray(router.path) ? router.path : [router.path],
    controllerName: splitArr[0],
    controllerMethods,
    schema: router.schema || {},
  };
}

class AstroboyRouterLoader extends Loader<Partial<IOptions>, IInnerApplication<Partial<IOptions>>> {
  load() {
    const routerArr: any[] = loadRouters(this.app.ROOT_PATH, this.config.pattern);
    const controllers = this.app.controllers;
    const routers: any[] = [];

    routerArr.forEach(item => {
      const router = Array.isArray(item) ? parseOldRouter(item) : parseNewRouter(item);
      router.controller = controllers[router.controllerName];

      router.method.forEach((method: string) => {
        if (METHODS.indexOf(method.toUpperCase()) === -1) {
          throw new Error(`注册路由失败，请求方法 ${method} 不是一个标准的 HTTP 请求方法！`);
        }
      });
      if (!router.controller) {
        throw new Error(`注册路由失败，控制器 ${router.controllerName} 未找到！`);
      }
      if (!lodash.isFunction(router.controller)) {
        throw new Error(`注册路由失败，${router.controllerName} 必须是一个类`);
      }
      const newControllerMethods = [];
      if (router.controller.prototype['init']) {
        newControllerMethods.push('init');
      }
      router.controllerMethods.forEach((method: any) => {
        if (!router.controller.prototype[method]) {
          throw new Error(`注册路由失败，控制器类 ${router.controllerName} 不存在方法名为 ${method} 的方法！`);
        } else {
          const beforeMethod = 'before' + method.slice(0, 1).toUpperCase() + method.slice(1);
          if (router.controller.prototype[beforeMethod]) {
            newControllerMethods.push(beforeMethod);
          }
          newControllerMethods.push(method);
        }
      });
      router.controllerMethods = newControllerMethods;

      router.compiledSchema = {};
      if (check(router.schema.header)) {
        router.compiledSchema.header = ajv.compile(router.schema.header);
      }
      if (check(router.schema.query)) {
        router.compiledSchema.query = ajv.compile(router.schema.query);
      }
      if (check(router.schema.body)) {
        router.compiledSchema.body = ajv.compile(router.schema.body);
      }

      routers.push(router);
    });

    this.app.routers = routers;
  }
}

export = AstroboyRouterLoader;
