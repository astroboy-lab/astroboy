/**
 * 框架路由中间件
 */
const lodash = require('lodash');
const KoaRouter = require('koa-router');
const compose = require('koa-compose');

module.exports = function (options = {}, app) {
  const koaRouter = new KoaRouter();

  app.routers.forEach(router => {
    const ControllerClass = router.controller;
    if (ControllerClass) {
      if (lodash.isFunction(ControllerClass)) {
        for (let i = 0; i < router.methods.length; i++) {
          if (!ControllerClass.prototype[router.methods[i]]) {
            throw new Error(`注册路由失败，verb:${router.verb} path:${router.path}, method:${router.methods[i]} is not found.`);
          }
        }
        router.path.forEach(item => {
          koaRouter[router.verb](router.name, item, async function (ctx, next) {
            const controller = new ControllerClass(ctx);
            // init 是 Controller 类初始化后调用的一个方法
            if (ControllerClass.prototype.init) {
              await controller['init']();
            }
            if (ctx.status !== 301 && ctx.status !== 302) {
              for (let i = 0; i < router.methods.length; i++) {
                let method = router.methods[i];
                const beforeMethod = 'before' + method.slice(0, 1).toUpperCase() + method.slice(1);
                if (ControllerClass.prototype[beforeMethod]) {
                  await controller[beforeMethod]();
                }
                if (ctx.status !== 301 && ctx.status !== 302) {
                  await controller[method](ctx, next);
                } else {
                  break;
                }
              }
            }
          });
        });
      } else {
        throw new Error(`注册路由失败，verb:${router.verb} path:${router.path}, controllerName:${router.controllerName} is not a function.`);
      }
    } else {
      throw new Error(`注册路由失败，verb:${router.verb} path:${router.path}, controllerName:${router.controllerName} is undefined.`);
    }
  });

  let fn = compose([
    koaRouter.routes(),
    koaRouter.allowedMethods()
  ]);
  fn._name = 'astroboy-router';
  return fn;
};