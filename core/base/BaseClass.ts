import { PureObject, IBaseContext, IBaseApplication } from '../contract';

/**
 * ctx Context 请求上下文对象
 * app Koa Application 实例对象
 * config 应用配置对象
 */
export class BaseClass<
  CTX extends PureObject = IBaseContext,
  APP extends PureObject = IBaseApplication,
  CONF extends PureObject = PureObject
> {
  protected app: APP;
  protected config: CONF;
  constructor(protected ctx: CTX) {
    this.app = ctx && ctx.app;
    this.config = ctx && ctx.app && ctx.app.config;
  }

  public getConfig(...args: any[]) {
    return this.ctx.getConfig(...args);
  }

  public getServiceClass(...args: any[]) {
    return this.ctx.getServiceClass(...args);
  }

  public getService(...args: any[]) {
    return this.ctx.getService(...args);
  }

  public callService(...args: any[]) {
    return this.ctx.callService(...args);
  }

  public invokeServiceMethod(...args: any[]) {
    return this.ctx.invokeServiceMethod(...args);
  }

  public getLib(...args: any[]) {
    return this.ctx.getLib(...args);
  }
}
