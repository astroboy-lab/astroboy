/**
 * 框架路由中间件
 */
const lodash = require('lodash');
const KoaRouter = require('koa-router');
const compose = require('koa-compose');
const pathToRegExp = require('path-to-regexp');
const methods = require('methods');

module.exports = function (options = {}, app) {
  const koaRouter = new KoaRouter();
  const routers = app.routers;
  const controllers = app.controllers;
  let newRouters = [];

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
      method: router[4],
      controllerName: router[3]
    });
  });

  newRouters.forEach(router => {
    const ControllerClass = router.controller;
    if (ControllerClass) {
      if (lodash.isFunction(ControllerClass)) {
        if (ControllerClass.prototype[router.method]) {
          router.path.forEach(item => {
            koaRouter[router.verb](router.name, item, async function (ctx, next) {
              const controller = new ControllerClass(ctx);
              if (ControllerClass.prototype.init) {
                await controller['init']();
              }
              if (ctx.status !== 301 && ctx.status !== 302) {
                const beforeMethod = 'before' + router.method.slice(0, 1).toUpperCase() + router.method.slice(1);
                if (ControllerClass.prototype[beforeMethod]) {
                  await controller[beforeMethod]();
                }
                if (ctx.status !== 301 && ctx.status !== 302) {
                  await controller[router.method](ctx, next);
                }
              }
            });
          });
        } else {
          throw new Error(`注册路由失败：${router.verb} ${router.path}, method ${router.method} is not found.`);
        }
      } else {
        throw new Error(`注册路由失败：${router.verb} ${router.path}, ${router.controllerName} is not a function.`);
      }
    } else {
      throw new Error(`注册路由失败：${router.verb} ${router.path}, ${router.controllerName} is undefined.`);
    }
  });

  let fn = compose([
    koaRouter.routes(),
    koaRouter.allowedMethods()
  ]);
  fn._name = 'astroboy-router';
  return fn;
};