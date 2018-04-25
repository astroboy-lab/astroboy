/**
 * 框架路由中间件
 */
const lodash = require('lodash');
const KoaRouter = require('koa-router');
const compose = require('koa-compose');

const HTTP_VERBS = ['head', 'options', 'get', 'put', 'patch', 'post', 'delete', 'all'];

module.exports = function(options = {}, app) {
  const koaRouter = new KoaRouter();
  const routers = app.routers;
  const controllers = app.controllers;

  routers.forEach(router => {
    let routerName; // 路由名字
    let verb; // HTTP 方法
    let registerPath; // 匹配路由
    if (HTTP_VERBS.indexOf(router[0].toLowerCase()) === -1) { // 说明第一个参数是 routerName
      routerName = router[0];
      verb = router[1].toLowerCase();
      registerPath = router[2];
    } else {
      routerName = '';
      verb = router[0].toLowerCase();
      registerPath = router[1];
    }
    if (!Array.isArray(registerPath)) {
      registerPath = [registerPath];
    }

    const ControllerClass = controllers[router[router.length - 2]]; // 倒数第二个
    const method = router[router.length - 1]; // 倒数第一个

    if (ControllerClass && lodash.isFunction(ControllerClass) && ControllerClass.prototype[method]) {
      registerPath.forEach(item => {
        koaRouter[verb](routerName, item, async function(ctx, next) {
          const controller = new ControllerClass(ctx);
          await controller[method](ctx, next);
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