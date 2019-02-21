'use strict';
const path = require('path');
const lodash = require('lodash');
const Loader = require('../core/Loader');

class AstroboyMiddlewareLoader extends Loader {
  load() {
    // 加载中间件配置
    let config = {};
    this.globDirs(this.config.configPattern, entries => {
      entries.forEach(entry => {
        config = lodash.merge(config, require(entry));
      });
    });
    this.app.middlewareConfig = config;

    // 加载中间件
    let middlewares = {};
    this.globDirs(this.config.pattern, entries => {
      entries.forEach(entry => {
        const key = this.resolveExtensions(path.basename(entry));
        middlewares[key] = require(entry);
      });
    });
    this.app.middlewares = middlewares;
  }
}

module.exports = AstroboyMiddlewareLoader;
