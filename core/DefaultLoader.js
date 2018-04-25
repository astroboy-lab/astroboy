const fs = require('fs-extra');
const path = require('path');
const glob = require('fast-glob');
const lodash = require('lodash');
const pathMatching = require('path-matching');
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
      dot: true
    });
    entries.forEach(entry => {
      const key = entry.split('controllers/')[1].replace('.js', '').replace('/', '.');
      controllers[key] = require(entry);
    });
    this.app.controllers = controllers;
    Util.outputJsonSync(`${this.baseDir}/run/controllers.json`, Object.keys(controllers));
  }

  loadServices() {
    let services = {};
    this.dirs.forEach(item => {
      this.globItem(item.baseDir, this.patterns.service, (entries) => {
        if (entries.length > 0) {
          services[item.name] = {};
          entries.forEach(entry => {
            const key = entry.split('services/')[1].replace('.js', '').replace(/\//g, '.');
            services[item.name][key] = require(entry);
          });
        }
      });
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
    const entries = glob.sync([`${this.baseDir}${this.patterns.router}`], {
      dot: true
    });
    entries.forEach(entry => {
      routers = routers.concat(require(entry));
    });
    this.app.routers = routers;
    Util.outputJsonSync(`${this.baseDir}/run/routers.json`, this.app.routers);
  }

  loadVersionFiles() {
    let map = {};
    const entries = glob.sync([`${this.baseDir}/config/version*.json`], {
      dot: true
    });
    entries.forEach(entry => {
      const key = path.basename(entry, '.json');
      map[key] = require(entry);
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
    let fn = async function (ctx, next) {
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