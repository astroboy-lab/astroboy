import { MiddlewareFactory } from '../../../../definitions';

/**
 * https://github.com/koajs/static
 */
// @ts-ignore typings missed
import staticM = require('koa-static');

const astroboyStaticFactory: MiddlewareFactory<{ root?: string }, any> = function(options, app) {
  let fn = staticM(options.root, options);
  fn._name = 'static';
  return fn;
};

export = astroboyStaticFactory;
