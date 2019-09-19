import * as path from 'path';
import * as lodash from 'lodash';
import { Loader } from '../core/Loader';
import { IInnerApplication, PureObject, MiddlewareFactory, PriorityDefine } from '../definitions/core';
import { IOptions } from '../definitions/config';
import { outputJsonSync } from '../core/lib/util';

class AstroboyMiddlewareLoader extends Loader<Partial<IOptions>, IInnerApplication<Partial<IOptions>>> {
  load() {
    // 加载中间件配置
    let middlewareConfig: PureObject = {};
    this.globDirs(this.config.configPattern || [], entries => {
      entries.forEach(entry => {
        middlewareConfig = lodash.merge(middlewareConfig, require(entry as string));
      });
    });
    this.app.middlewareConfig = middlewareConfig;

    // 加载中间件
    let middlewares: PureObject<MiddlewareFactory> = {};
    this.globDirs(this.config.pattern || [], entries => {
      entries.forEach(entry => {
        const key = this.resolveExtensions(path.basename(entry as string));
        middlewares[key] = require(entry as string);
      });
    });
    this.app.middlewares = middlewares;

    // 生成中间件加载顺序
    let middlewareQueue: PriorityDefine[] = [];
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
    outputJsonSync(`${this.app.ROOT_PATH}/run/middlewares.json`, middlewareQueue);
  }
}

export = AstroboyMiddlewareLoader;
