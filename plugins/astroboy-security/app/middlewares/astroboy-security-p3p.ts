/**
 * P3P - Platform for Privacy Preferences Project
 * https://en.wikipedia.org/wiki/P3P
 * @param {String/Object} options
 */
import * as assert from 'assert';
import { MiddlewareFactory } from '../../../../definitions';

const factory: MiddlewareFactory<{ value?: string } | string, any> = function(options, app) {
  if (typeof options === 'string') {
    options = {
      value: options,
    };
  }
  options = options || {};
  options.value = options.value || 'p3p';
  assert(typeof options.value === 'string', 'options.value should be a string');

  return async function p3p(ctx, next) {
    ctx.set('P3P', (<any>options).value);
    await next();
  };
};

export = factory;
