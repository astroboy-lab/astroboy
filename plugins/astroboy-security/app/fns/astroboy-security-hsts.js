/**
 * Strict-Transport-Security
 * https://developer.mozilla.org/zh-CN/docs/Security/HTTP_Strict_Transport_Security
 */
const assert = require('assert');

module.exports = function(options, app) {
  if (typeof options === 'number') {
    options = {
      maxAge: options,
    };
  }
  options = options || {};
  assert(typeof options.maxAge === 'number', 'options.maxAge should be a number');

  let value = 'max-age=' + options.maxAge;
  if (options.includeSubDomains) {
    value += '; includeSubDomains';
  }
  if (options.preload) {
    value += '; preload';
  }

  return function hsts(ctx) {
    ctx.set('Strict-Transport-Security', value);
  };
};
