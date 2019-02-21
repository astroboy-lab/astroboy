'use strict';
const lodash = require('lodash');
const Loader = require('../core/Loader');
const Util = require('../core/lib/util');

class AstroboyConfigLoader extends Loader {
  load() {
    let config = {};
    this.globDirs(this.config.pattern, entries => {
      config = entries.reduce((a, b) => {
        let content = require(b);
        // 配置文件支持两种写法：
        // 1、返回一个 function，执行改方法返回一个对象
        // 2、普通 JS 对象
        if (lodash.isFunction(content)) {
          return lodash.merge(a, content(this.app));
        } else if (lodash.isPlainObject(content)) {
          return lodash.merge(a, content);
        }
      }, config);
    });
    this.app.config = config;
    Util.outputJsonSync(`${this.app.ROOT_PATH}/run/config.json`, config);
  }
}

module.exports = AstroboyConfigLoader;
