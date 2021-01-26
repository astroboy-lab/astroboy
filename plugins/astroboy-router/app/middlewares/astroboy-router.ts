/**
 * 框架路由中间件
 */
// @ts-ignore
import * as KoaRouter from 'koa-router';
import * as compose from 'koa-compose';

import { MiddlewareFactory, IConstructor } from '../../../../definitions';
import { IInnerApplication } from '../../../../definitions/core';

const factory: MiddlewareFactory<any, IInnerApplication> = function(options = {}, app) {
  const koaRouter = new KoaRouter();

  app.routers.forEach((router: any) => {
    for (let i = 0; i < router.method.length; i++) {
      const method = router.method[i];
      for (let j = 0; j < router.path.length; j++) {
        const path = router.path[j];
        koaRouter[method](router.name, path, async function(ctx: any, next: () => Promise<any>) {
          const ControllerClass: IConstructor<any> = router.controller;
          const controller = new (<any>ControllerClass)(ctx);
          const controllerMethods = router.controllerMethods;

          for (let k = 0; k < controllerMethods.length; k++) {
            const action = controllerMethods[k];
            if (ctx.status !== 301 && ctx.status !== 302 && !ctx.body) {
              await controller[action](ctx, next);
            } else {
              break;
            }
          }
        });
      }
    }
  });

  let fn = compose([koaRouter.routes(), koaRouter.allowedMethods()]);
  (<any>fn)._name = 'astroboy-router';
  return fn;
};

export = factory;
