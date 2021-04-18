import { MiddlewareFactory } from '../../../../definitions';

/**
 * X-Content-Type-Options
 * https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/X-Content-Type-Options
 */
const astroboySecurityCTOFactory: MiddlewareFactory<string, any> = function(options = 'nosniff', app) {
  return function cto(ctx, next) {
    ctx.set('X-Content-Type-Options', options);
    return next();
  };
};

export = astroboySecurityCTOFactory;
