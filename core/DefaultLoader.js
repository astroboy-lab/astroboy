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
    this.loadControllers();
    this.loadServices();
    this.loadRouters();
    this.loadVersionFiles();
    this.useMiddlewares();
  }

  loadControllers() {
    let controllers = {};
    const entries = glob.sync([`${this.baseDir}${this.patterns.controller}`], {
      dot: true,
    });
    entries
      .filter(i => !i.includes('.d.ts'))
      .forEach(entry => {
        const key = this.resolveExtensions(entry.split('controllers/')[1], true);
        controllers[key] = require(entry);
      });
    this.app.controllers = controllers;
    Util.outputJsonSync(`${this.baseDir}/run/controllers.json`, Object.keys(controllers));
  }

  // 如果 app/services 目录存在 index.js 文件，则只需加载该文件
  loadServices() {
    let services = {};
    this.dirs.forEach(item => {
      const indexFile = `${item.baseDir}/app/services/index.js`;
      if (fs.existsSync(indexFile)) {
        services[item.name] = require(indexFile);
      } else {
        this.globItem(item.baseDir, this.patterns.service, entries => {
          if (entries.length > 0) {
            services[item.name] = {};
            entries.forEach(entry => {
              const key = this.resolveExtensions(entry.split('services/')[1], true);
              services[item.name][key] = require(entry);
            });
          }
        });
      }
    });
    this.app.services = services;

    let logServices = {};
    for (let packageName in services) {
      logServices[packageName] = Object.keys(services[packageName]);
    }
    Util.outputJsonSync(`${this.baseDir}/run/services.json`, logServices);
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

  loadVersionFiles() {
    let map = {};
    this.dirs.forEach(item => {
      const entries = glob.sync([`${item.baseDir}/config/version*.json`], {
        dot: true,
      });
      if (entries.length > 0) {
        entries.forEach(entry => {
          const key = path.basename(entry, '.json');
          map[key] = require(entry);
        });
      }
    });
    this.app.versionMap = map;
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
