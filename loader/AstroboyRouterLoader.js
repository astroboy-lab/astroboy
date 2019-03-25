'use strict';
const fs = require('fs-extra');
const glob = require('fast-glob');
const methods = require('methods');
const Loader = require('../core/Loader');

class AstroboyRouterLoader extends Loader {
  load() {
    let routers = [];
    const indexFile = `${this.app.ROOT_PATH}/app/routers/index.js`;
    if (fs.existsSync(indexFile)) {
      routers = require(indexFile);
    } else {
      const entries = glob.sync([`${this.app.ROOT_PATH}${this.config.pattern}`], {
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
  }
}

module.exports = AstroboyRouterLoader;
