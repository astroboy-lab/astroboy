/**
 * https://github.com/koajs/static
 */
const staticM = require('koa-static');

module.exports = function (options, app) {
  let fn = staticM(options.root, options);
  fn._name = 'static';
  return fn;
};