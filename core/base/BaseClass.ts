import { PureObject, IBaseApplication, IBaseContext } from '../../definitions/core';
import { IAstroboyApplication, IAstroboyContext } from '../../definitions';
import {
  IAstroboyCtxExtends,
  IArgumentsExtractor,
  IServiceProtected,
  ReturnAnyType,
} from '../../definitions/extends/context';

/**
 * ctx Context 请求上下文对象
 * app Koa Application 实例对象
 * config 应用配置对象
 */
export class BaseClass<
  CONF extends PureObject = PureObject,
  APP extends IBaseApplication = IAstroboyApplication<CONF>,
  CTX extends IBaseContext = IAstroboyContext<CONF, APP>,
  SERVICES extends PureObject = PureObject,
  CONTROLLERS extends PureObject = PureObject,
  LIBS extends PureObject = PureObject
> implements IAstroboyCtxExtends<CONF, APP> {
  protected app: APP;
  protected config: CONF;
  constructor(protected ctx: CTX) {
    this.app = <any>(ctx && ctx.app);
    this.config = <any>(ctx && ctx.app && ctx.app.config);
  }

  public getConfig(): CONF;
  public getConfig<K extends keyof CONF>(key: K): CONF[K];
  public getConfig(...args: any[]) {
    return this.ctx.getConfig(...args);
  }

  public getLib<PkgName extends keyof LIBS, LibName extends keyof LIBS[PkgName], LibMethods = LIBS[PkgName][LibName]>(
    pkgName: PkgName,
    libName: LibName
  ): LibMethods;
  public getLib(...args: any[]): any {
    return this.ctx.getLib(...args);
  }

  public getServiceClass<
    PkgName extends keyof SERVICES,
    ServiceName extends keyof SERVICES[PkgName],
    ServiceClass = SERVICES[PkgName][ServiceName]
  >(pkgName: PkgName, serviceName: ServiceName): ServiceClass;
  public getServiceClass(...args: any[]) {
    return this.ctx.getServiceClass(...args);
  }

  public getService<
    PkgName extends keyof SERVICES,
    ServiceName extends keyof SERVICES[PkgName],
    ServiceInstance = InstanceType<SERVICES[PkgName][ServiceName]>
  >(pkgName: PkgName, serviceName: ServiceName): ServiceInstance;
  public getService(...args: any[]): any {
    return this.ctx.getService(...args);
  }

  public callService(service: string, method: string, ...args: any[]): Promise<any>;
  public callService(method: string, ...args: any[]): Promise<any>;
  public callService(...args: any[]) {
    return this.ctx.callService(...args);
  }

  public invokeServiceMethod<
    PkgName extends keyof SERVICES,
    ServiceName extends keyof SERVICES[PkgName],
    MethodName extends Exclude<keyof InstanceType<SERVICES[PkgName][ServiceName]>, keyof IServiceProtected>,
    MethodArgs extends IArgumentsExtractor<InstanceType<SERVICES[PkgName][ServiceName]>[MethodName]>,
    Result extends ReturnAnyType<InstanceType<SERVICES[PkgName][ServiceName]>[MethodName]>
  >(pkgName: PkgName, serviceName: ServiceName, methodName: MethodName, ...args: MethodArgs): Result;
  public invokeServiceMethod(...args: any[]): any {
    return this.ctx.invokeServiceMethod(...args);
  }
}
