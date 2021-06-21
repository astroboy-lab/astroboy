/**
 * Strict-Transport-Security
 * https://developer.mozilla.org/zh-CN/docs/Security/HTTP_Strict_Transport_Security
 */
import * as assert from 'assert';
import { MiddlewareFactory } from '../../../../definitions';
import { IHstsOptions } from '../../contract';

const astroboySecurityHSTSFactory: MiddlewareFactory<Partial<IHstsOptions> | number, any> = function(options, app) {
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

  return function hsts(ctx, next) {
    ctx.set('Strict-Transport-Security', value);
    return next();
  };
};

export = astroboySecurityHSTSFactory;
