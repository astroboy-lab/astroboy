const fs = require('fs-extra');
const path = require('path');
const glob = require('fast-glob');
const pathMatching = require('path-matching');
const methods = require('methods');
const CoreLoader = require('./base/CoreLoader');
const Util = require('./lib/util');

class DefaultLoader extends CoreLoader {
  constructor(options = {}) {
    super(options);
  }

  init() {
    super.init();
    this.loadRouters();
    this.useMiddlewares();
  }

  loadRouters() {
    let routers = [];
    const indexFile = `${this.baseDir}/app/routers/index.js`;
    if (fs.existsSync(indexFile)) {
      routers = require(indexFile);
    } else {
      const entries = glob.sync([`${this.baseDir}${this.patterns.router}`], {
        dot: true,
      });
      entries.forEach(entry => {
        routers = routers.concat(require(entry));
      });
    }

    const controllers = this.app.controllers;
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
        methods: Array.isArray(router[4]) ? router[4] : [router[4]],
        controllerName: router[3],
      });
    });
    this.app.routers = newRouters;
    Util.outputJsonSync(`${this.baseDir}/run/routers.json`, newRouters);
  }

  useMiddlewares() {
    const app = this.app;
    const middlewares = app.middlewares;
    app.middlewareQueue.forEach(item => {
      if (middlewares[item.name]) {
        let fn = middlewares[item.name](item.options, app);
        fn = this.wrapMiddleware(fn, item);
        if (fn) {
          app.use(fn);
        }
      } else {
        throw new Error(`middleware ${item.name} is not found.`);
      }
    });
  }

  wrapMiddleware(middleware, options) {
    const match = pathMatching(options);
    let fn = async function(ctx, next) {
      if (match(ctx)) {
        await middleware(ctx, next);
      } else {
        await next();
      }
    };
    fn._name = `wrap-${middleware.name || middleware._name}`;
    return fn;
  }
}

module.exports = DefaultLoader;
