import * as lodash from 'lodash';
import { Loader } from '../core/Loader';
import { IInnerApplication } from '../definitions/core';
import { IOptions } from '../definitions/config';
import { outputJsonSync } from '../core/lib/util';

class AstroboyConfigLoader extends Loader<Partial<IOptions>, IInnerApplication<Partial<IOptions>>> {
  load() {
    let config: Partial<IOptions> = {};
    this.globDirs(this.config.pattern || [], entries => {
      config = entries.reduce((a, b) => {
        var filePath = b as string;
        // glob识别多个插槽可能有点问题，会导致default顺序不严格在第一位
        // 为了确保稳定，default的config必须优先作为base，所以在这里强硬做了区分
        var isDefault = isDefaultConfigFile(filePath);
        let content = require(filePath as string);
        // 配置文件支持两种写法：
        // 1、返回一个 function，执行改方法返回一个对象
        // 2、普通 JS 对象
        // default的配置必须总是最优先，无论顺序如何
        if (lodash.isFunction(content)) {
          return isDefault ? lodash.merge(content(this.app), a) : lodash.merge(a, content(this.app));
        } else if (lodash.isPlainObject(content)) {
          return isDefault ? lodash.merge(content, a) : lodash.merge(a, content);
        }
      }, config);
    });

    this.app.config = config;
    outputJsonSync(`${this.app.ROOT_PATH}/run/config.json`, config);
  }
}

function isDefaultConfigFile(filePath: string) {
  return filePath.endsWith('.default.js') || filePath.endsWith('.default.ts');
}

export = AstroboyConfigLoader;
