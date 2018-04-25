/**
 * https://github.com/koajs/static
 */
const static = require('koa-static');

module.exports = function(options, app) {
  let fn = static(options.root, options);
  fn._name = 'static';
  return fn;
};