/**
 * CSRF
 */
import { Token } from '../lib/token';
import { MiddlewareFactory } from '../../../../definitions';
import { ICsrfOptions } from '../../../../definitions/plugins/astroboy-security/middleware';

class CsrfError extends Error {
  public errorContent: any;
  public errorType: any;
  constructor(code: number, msg: string) {
    super(`code: ${code}, msg: ${msg}`);
    this.errorContent = {
      code,
      msg,
    };
    this.errorType = 'CsrfError';
  }
}

const factory: MiddlewareFactory<Partial<ICsrfOptions>, any> = function(options = {}, app) {
  let token = new Token({
    saltLength: options.saltLength,
    secretLength: options.secretLength,
  });

  return async function csrf(ctx, next) {
    if (
      (options.excluded || []).indexOf(ctx.method) === -1 &&
      (options.env || []).indexOf(process.env.NODE_ENV!) > -1
    ) {
      const csrfSecret = ctx.cookies.get(options.csrfSecretName);
      const csrfToken = ctx.header[options.csrfTokenName!];

      // token 或 secret 不存在
      if (!csrfSecret || !csrfToken) {
        throw new CsrfError(1000, 'CSRF Token Not Found!');
      }
      // token 校验失败
      if (!token.verify(csrfSecret, csrfToken)) {
        throw new CsrfError(1001, 'CSRF token Invalid!');
      }
    }

    await next();

    // 如果返回 HTML 格式数据，则生成
    if (ctx.response.is('text/html')) {
      const secret = token.secretSync();
      const newToken = token.create(secret);

      ctx.cookies.set(options.csrfSecretName, secret, {
        maxAge: options.maxAge,
      });
      ctx.cookies.set(options.csrfTokenName, newToken, {
        maxAge: options.maxAge,
        httpOnly: false,
      });
    }
  };
};

export = factory;
