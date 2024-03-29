/**
 * 框架路由中间件
 */
// @ts-ignore
import * as KoaRouter from 'koa-router';
import * as compose from 'koa-compose';

import { MiddlewareFactory, IConstructor } from '../../../../definitions';
import { IInnerApplication } from '../../../../definitions/core';

const astroboyRouterFactory: MiddlewareFactory<any, IInnerApplication> = function(options = {}, app) {
  const koaRouter = new KoaRouter();

  app.routers.forEach((router: any) => {
    router.middleware.push(async function callback(ctx: any, next: () => Promise<any>) {
      if (router.compiledSchema.header) {
        const valid = router.compiledSchema.header(ctx.headers);
        if (!valid) {
          ctx.body = {
            code: 'ERR_HTTP_REQUEST_HEADER_VALID_FAILED',
            msg: 'Header 请求头参数校验失败',
            data: router.compiledSchema.header.errors,
          };
          return;
        }
      }

      if (router.compiledSchema.query) {
        const valid = router.compiledSchema.query(ctx.query);
        if (!valid) {
          ctx.body = {
            code: 'ERR_HTTP_REQUEST_QUERY_VALID_FAILED',
            msg: 'Query 查询参数校验失败',
            data: router.compiledSchema.query.errors,
          };
          return;
        }
      }

      if (router.compiledSchema.body) {
        const valid = router.compiledSchema.body(ctx.request.body);
        if (!valid) {
          ctx.body = {
            code: 'ERR_HTTP_REQUEST_BODY_VALID_FAILED',
            msg: 'Body 请求参数校验失败',
            data: router.compiledSchema.body.errors,
          };
          return;
        }
      }

      const ControllerClass: IConstructor<any> = router.controller;
      const controller = new (<any>ControllerClass)(ctx);
      const controllerMethods = router.controllerMethods;

      for (let k = 0; k < controllerMethods.length; k++) {
        const action = controllerMethods[k];
        if (action === 'init') {
          await controller[action]();
        } else if (ctx.status !== 301 && ctx.status !== 302 && !ctx.body) {
          await controller[action](ctx, next);
        } else {
          break;
        }
      }
    });

    for (let i = 0; i < router.method.length; i++) {
      const method = router.method[i].toLowerCase();
      for (let j = 0; j < router.path.length; j++) {
        const path = router.path[j];

        koaRouter[method](router.name, path, ...router.middleware);
      }
    }
  });

  let fn = compose([koaRouter.routes(), koaRouter.allowedMethods()]);
  (<any>fn)._name = 'astroboy-router';
  return fn;
};

export = astroboyRouterFactory;
