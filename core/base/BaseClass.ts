import { PureObject } from '../../definitions/core';
import { IAstroboyApplication, IAstroboyContext } from '../../definitions';
import { IAstroboyCtxExtends } from '../../definitions/extends/context';

/**
 * ctx Context 请求上下文对象
 * app Koa Application 实例对象
 * config 应用配置对象
 */
export class BaseClass<
  CONF extends PureObject = PureObject,
  APP extends any = IAstroboyApplication<CONF>,
  CTX extends any = IAstroboyContext<CONF, APP>
> implements IAstroboyCtxExtends<CONF, APP> {
  protected app: APP;
  protected config: CONF;
  constructor(protected ctx: CTX) {
    this.app = ctx && ctx.app;
    this.config = ctx && ctx.app && ctx.app.config;
  }

  public getConfig(): CONF;
  public getConfig<K extends keyof CONF>(key: K): CONF[K];
  public getConfig(...args: any[]) {
    return this.ctx.getConfig(...args);
  }

  public getServiceClass(packageName: string, serviceName: string): any;
  public getServiceClass(...args: any[]) {
    return this.ctx.getServiceClass(...args);
  }

  public getService(packageName: string, serviceName: string): any;
  public getService(...args: any[]) {
    return this.ctx.getService(...args);
  }

  public callService(service: string, method: string, ...args: any[]): Promise<any>;
  public callService(method: string, ...args: any[]): Promise<any>;
  public callService(...args: any[]) {
    return this.ctx.callService(...args);
  }

  public invokeServiceMethod(pkgName: string, serviceName: string, methodName: string, ...args: any[]): Promise<any>;
  public invokeServiceMethod(...args: any[]) {
    return this.ctx.invokeServiceMethod(...args);
  }

  public getLib(packageName: string, libName: string): any;
  public getLib(...args: any[]) {
    return this.ctx.getLib(...args);
  }
}
