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
      method: router[4]
    });
  });

  newRouters.forEach(router => {
    const ControllerClass = router.controller;
    if (ControllerClass && lodash.isFunction(ControllerClass) && ControllerClass.prototype[router.method]) {
      router.path.forEach(item => {
        koaRouter[router.verb](router.name, item, async function (ctx, next) {
          const controller = new ControllerClass(ctx);
          await controller[router.method](ctx, next);
        });
      });
    }
  });

  let fn = compose([
    koaRouter.routes(),
    koaRouter.allowedMethods()
  ]);
  fn._name = 'astroboy-router';
  return fn;
};