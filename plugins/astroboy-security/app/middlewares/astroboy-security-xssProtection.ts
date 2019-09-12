import { MiddlewareFactory } from '../../../../definitions';

/**
 * X-XSS-Protection: 0 禁止XSS过滤。
 * X-XSS-Protection: 1 启用XSS过滤（通常浏览器是默认的）。如果检测到跨站脚本攻击，浏览器将清除页面（删除不安全的部分）。
 * X-XSS-Protection: 1; mode=block 启用XSS过滤。如果检测到攻击，浏览器将不会清除页面，而是阻止页面加载。
 * X-XSS-Protection: 1; report=<reporting-uri> 启用XSS过滤。如果检测到跨站脚本攻击，浏览器将清除页面并使用CSP report-uri指令的功能发送违规报告。
 * https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/X-XSS-Protection
 */
const factory: MiddlewareFactory<string, any> = function(options = '1; mode=block', app) {
  return function xssProtection(ctx, next) {
    ctx.set('X-XSS-Protection', options);
    return next();
  };
};

export = factory;
