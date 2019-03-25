'use strict';
const path = require('path');
const lodash = require('lodash');
const Loader = require('../core/Loader');
const Util = require('../core/lib/util');

class AstroboyMiddlewareLoader extends Loader {
  load() {
    // 加载中间件配置
    let middlewareConfig = {};
    this.globDirs(this.config.configPattern, entries => {
      entries.forEach(entry => {
        middlewareConfig = lodash.merge(middlewareConfig, require(entry));
      });
    });
    this.app.middlewareConfig = middlewareConfig;

    // 加载中间件
    let middlewares = {};
    this.globDirs(this.config.pattern, entries => {
      entries.forEach(entry => {
        const key = this.resolveExtensions(path.basename(entry));
        middlewares[key] = require(entry);
      });
    });
    this.app.middlewares = middlewares;

    // 生成中间件加载顺序
    let middlewareQueue = [];
    Object.keys(middlewareConfig).forEach(item => {
      middlewareQueue.push(
        Object.assign(
          {
            priority: 300,
            name: item,
          },
          middlewareConfig[item]
        )
      );
    });
    middlewareQueue = middlewareQueue
      .filter(item => {
        return item.enable === true;
      })
      .sort((a, b) => {
        return a.priority - b.priority;
      });
    this.app.middlewareQueue = middlewareQueue;
    Util.outputJsonSync(`${this.app.ROOT_PATH}/run/middlewares.json`, middlewareQueue);
  }
}

module.exports = AstroboyMiddlewareLoader;
