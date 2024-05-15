import * as path from 'path';
import * as lodash from 'lodash';
import { Loader } from '../core/Loader';
import { IInnerApplication, PureObject, MiddlewareFactory, PriorityDefine } from '../definitions/core';
import { IOptions } from '../definitions/config';
import { outputJsonAsync } from '../core/lib/util';

class AstroboyMiddlewareLoader extends Loader<Partial<IOptions>, IInnerApplication<Partial<IOptions>>> {
  async load() {
    // 加载中间件配置
    let middlewareConfig: PureObject = {};
    const configEntries = await this.globDirs(this.config.configPattern || []);
    configEntries.forEach((entry) => {
      middlewareConfig = lodash.merge(middlewareConfig, require(entry));
    });
    this.app.middlewareConfig = middlewareConfig;

    // 加载中间件文件
    let middlewares: PureObject<MiddlewareFactory> = {};
    const entries = await this.globDirs(this.config.pattern || []);
    entries.forEach((entry) => {
      const key = this.resolveExtensions(path.basename(entry as string));

      middlewares[key] = require(entry as string);

      if (middlewareConfig[key]) {
        try {
          middlewareConfig[key]['__debug_path'] = entry;
        } catch {
          /* noop */
        }
      }
    });
    this.app.middlewares = middlewares;

    // 生成中间件加载顺序
    let middlewareQueue: PriorityDefine[] = [];
    Object.keys(middlewareConfig).forEach((item) => {
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
      .filter((item) => {
        return item.enable === true;
      })
      .sort((a, b) => {
        return a.priority - b.priority;
      });
    this.app.middlewareQueue = middlewareQueue;
    await outputJsonAsync(`${this.app.ROOT_PATH}/run/middlewares.json`, middlewareQueue);
  }
}

export = AstroboyMiddlewareLoader;
