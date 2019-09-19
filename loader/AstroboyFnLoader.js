'use strict';
const path = require('path');
const lodash = require('lodash');
const Loader = require('../core/Loader');
const Util = require('../core/lib/util');

class AstroboyFnLoader extends Loader {
  load() {
    // 加载 Fn配置
    let fnConfig = {};
    this.globDirs(this.config.configPattern, entries => {
      entries.forEach(entry => {
        fnConfig = lodash.merge(fnConfig, require(entry));
      });
    });
    this.app.fnConfig = fnConfig;

    // 加载 Fn
    let fns = {};
    this.globDirs(this.config.pattern, entries => {
      entries.forEach(entry => {
        const key = this.resolveExtensions(path.basename(entry));
        fns[key] = require(entry);
      });
    });
    this.app.fns = fns;

    // 生成中间件加载顺序
    let fnQueue = [];
    Object.keys(fnConfig).forEach(item => {
      fnQueue.push(
        Object.assign(
          {
            priority: 300,
            name: item,
          },
          fnConfig[item]
        )
      );
    });
    fnQueue = fnQueue
      .filter(item => {
        return item.enable === true;
      })
      .sort((a, b) => {
        return a.priority - b.priority;
      });
    this.app.fnQueue = fnQueue;
    Util.outputJsonSync(`${this.app.ROOT_PATH}/run/fns.json`, fnQueue);
  }
}

module.exports = AstroboyFnLoader;
