/**
 * 框架路由中间件
 */
import * as lodash from 'lodash';
// @ts-ignore typings missed
import * as KoaRouter from 'koa-router';
import * as compose from 'koa-compose';

import { MiddlewareFactory, IConstructor } from '../../../../definitions';
import { IInnerApplication } from '../../../../definitions/core';

const factory: MiddlewareFactory<any, IInnerApplication> = function(options = {}, app) {
  const koaRouter = new KoaRouter();

  app.routers.forEach((router: any) => {
    const ControllerClass: IConstructor<any> = router.controllerClass;
    if (ControllerClass) {
      if (lodash.isFunction(ControllerClass)) {
        for (let i = 0; i < router.controllerMethod.length; i++) {
          if (!ControllerClass.prototype[router.controllerMethod[i]]) {
            throw new Error(
              `注册路由失败，method:${router.method} path:${router.path}, method:${router.controllerMethod[i]} is not found.`
            );
          }
        }
        router.path.forEach((item: any) => {
          koaRouter[router.method](router.name, item, async function(ctx: any, next: () => Promise<any>) {
            const controller = new (<any>ControllerClass)(ctx);
            // init 是 Controller 类初始化后调用的一个方法
            if (ControllerClass.prototype.init) {
              await controller['init']();
            }
            if (ctx.status !== 301 && ctx.status !== 302) {
              for (let i = 0; i < router.controllerMethod.length; i++) {
                let method = router.controllerMethod[i];
                const beforeMethod = 'before' + method.slice(0, 1).toUpperCase() + method.slice(1);
                if (ControllerClass.prototype[beforeMethod]) {
                  await controller[beforeMethod]();
                }
                if (ctx.status !== 301 && ctx.status !== 302 && !ctx.body) {
                  await controller[method](ctx, next);
                } else {
                  break;
                }
              }
            }
          });
        });
      } else {
        throw new Error(
          `注册路由失败，method:${router.method} path:${router.path}, controllerName:${router.controllerName} is not a function.`
        );
      }
    } else {
      throw new Error(
        `注册路由失败，method:${router.method} path:${router.path}, controllerName:${router.controllerName} is undefined.`
      );
    }
  });

  let fn = compose([koaRouter.routes(), koaRouter.allowedMethods()]);
  (<any>fn)._name = 'astroboy-router';
  return fn;
};

export = factory;
