/**
 * P3P - Platform for Privacy Preferences Project
 * https://en.wikipedia.org/wiki/P3P
 * @param {String/Object} options
 */
const assert = require('assert');

module.exports = function(options, app) {
  if (typeof options === 'string') {
    options = {
      value: options
    };
  }
  options = options || {};
  options.value = options.value || 'p3p';
  assert(typeof options.value === 'string', 'options.value should be a string');

  return async function p3p(ctx, next) {
    ctx.set('P3P', options.value);
    await next();
  };
};