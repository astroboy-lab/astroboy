import * as lodash from 'lodash';
import { Loader } from '../core/Loader';
import { IInnerApplication } from '../definitions/core';
import { IOptions } from '../definitions/config';
import { outputJsonAsync } from '../core/lib/util';

class AstroboyConfigLoader extends Loader<Partial<IOptions>, IInnerApplication<Partial<IOptions>>> {
  async load() {
    let config: Partial<IOptions> = {};
    await this.globDirs(this.config.pattern || [], entries => {
      config = entries.reduce((a, b) => {
        let content = require(b as string);
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
    await outputJsonAsync(`${this.app.ROOT_PATH}/run/config.json`, config);
  }
}

export = AstroboyConfigLoader;
