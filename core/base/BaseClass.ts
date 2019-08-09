import { IAstroboyFrameworkDefine } from '../../definitions';
import {
  IAstroboyCtxExtends,
  IArgumentsExtractor,
  IServiceProtected,
  ReturnAnyType,
  IBaseFrameworkDefine,
} from '../../definitions/extends/context';

/**
 * ## Astroboy Base Class
 * - `ctx` Context 请求上下文对象
 * - `app` Koa Application 实例对象
 * - `config` 应用配置对象
 *
 * @author Big Mogician
 * @export
 * @class BaseClass
 * @implements {IAstroboyCtxExtends<DEFINE>}
 * @template DEFINE Framework Definition, default is `IAstroboyFrameworkDefine`
 */
export class BaseClass<DEFINE extends Partial<IBaseFrameworkDefine> = IAstroboyFrameworkDefine>
  implements IAstroboyCtxExtends<DEFINE> {
  protected app: DEFINE['app'];
  protected config: DEFINE['config'];
  protected ctx: DEFINE['ctx'];
  constructor(ctx: DEFINE['ctx']) {
    this.ctx = <any>ctx;
    this.app = <any>(ctx && ctx.app);
    this.config = <any>(ctx && ctx.app && ctx.app.config);
  }

  public getConfig(): DEFINE['config'];
  public getConfig<K extends keyof DEFINE['config']>(key: K): DEFINE['config'][K];
  public getConfig(...args: any[]) {
    return this.ctx.getConfig(...args);
  }

  public getLib<
    PkgName extends keyof DEFINE['libs'],
    LibName extends keyof DEFINE['libs'][PkgName],
    LibMethods = DEFINE['libs'][PkgName][LibName]
  >(pkgName: PkgName, libName: LibName): LibMethods;
  public getLib(...args: any[]): any {
    return this.ctx.getLib(...args);
  }

  public getServiceClass<
    PkgName extends keyof DEFINE['services'],
    ServiceName extends keyof DEFINE['services'][PkgName],
    ServiceClass = DEFINE['services'][PkgName][ServiceName]
  >(pkgName: PkgName, serviceName: ServiceName): ServiceClass;
  public getServiceClass(...args: any[]) {
    return this.ctx.getServiceClass(...args);
  }

  public getService<
    PkgName extends keyof DEFINE['services'],
    ServiceName extends keyof DEFINE['services'][PkgName],
    ServiceInstance = InstanceType<DEFINE['services'][PkgName][ServiceName]>
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
    PkgName extends keyof DEFINE['services'],
    ServiceName extends keyof DEFINE['services'][PkgName],
    MethodName extends Exclude<keyof InstanceType<DEFINE['services'][PkgName][ServiceName]>, keyof IServiceProtected>,
    MethodArgs extends IArgumentsExtractor<InstanceType<DEFINE['services'][PkgName][ServiceName]>[MethodName]>,
    Result extends ReturnAnyType<InstanceType<DEFINE['services'][PkgName][ServiceName]>[MethodName]>
  >(pkgName: PkgName, serviceName: ServiceName, methodName: MethodName, ...args: MethodArgs): Result;
  public invokeServiceMethod(...args: any[]): any {
    return this.ctx.invokeServiceMethod(...args);
  }
}
