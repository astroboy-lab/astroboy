/**
 * 框架路由中间件
 */
// @ts-ignore typings missed
import * as KoaRouter from 'koa-router';
import * as compose from 'koa-compose';

import { MiddlewareFactory, IConstructor } from '../../../../definitions';
import { IInnerApplication } from '../../../../definitions/core';

const factory: MiddlewareFactory<any, IInnerApplication> = function(options = {}, app) {
  const koaRouter = new KoaRouter();

  app.routers.forEach((router: any) => {
    const ControllerClass: IConstructor<any> = router.controllerClass;
    router.path.forEach((item: any) => {
      koaRouter[router.method](router.name, item, async function(ctx: any, next: () => Promise<any>) {
        const controller = new (<any>ControllerClass)(ctx);
        // init 是 Controller 类初始化后调用的一个方法
        if (ControllerClass.prototype.init) {
          router.controllerMethod.unshift('init');
        }
        for (let i = 0; i < router.controllerMethod.length; i++) {
          const method = router.controllerMethod[i];
          const beforeMethod = 'before' + method.slice(0, 1).toUpperCase() + method.slice(1);
          if (ControllerClass.prototype[beforeMethod]) {
            router.controllerMethod.splice(i, 0, beforeMethod);
            i++;
          }
        }
        for (let i = 0; i < router.controllerMethod.length; i++) {
          await controller[router.controllerMethod[i]](ctx, next);
          if (ctx.status === 301 || ctx.status === 302 || ctx.body) {
            break;
          }
        }
      });
    });
  });

  let fn = compose([koaRouter.routes(), koaRouter.allowedMethods()]);
  (<any>fn)._name = 'astroboy-router';
  return fn;
};

export = factory;
