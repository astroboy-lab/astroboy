/**
 * 请求体解析中间件
 */
import * as koaBody from 'koa-body';
// @ts-ignore typings missed
import * as bodyParser from 'koa-bodyparser';

import { MiddlewareFactory } from '../../../../definitions';

const factory: MiddlewareFactory<any, any> = (options, app) => {
  let fn = options.parser === 'koa-bodyparser' ? bodyParser(options) : koaBody(options);
  fn._name = 'body';
  return fn;
};

export = factory;