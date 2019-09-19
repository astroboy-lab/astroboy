import { PureObject, IBaseApplication, IBaseContext } from '../core';
export type ReturnAnyType<T = any> = T extends (...args: any[]) => infer R ? R : any;
export type IArgumentsExtractor<T> = T extends (...params: infer P) => infer R ? P : any[];
export interface IServiceProtected {
  ctx: any;
  app: any;
  config: any;
  getConfig: any;
  getLib: any;
  getServiceClass: any;
  getService: any;
  callService: any;
  invokeServiceMethod: any;
}

export interface IBaseFrameworkDefine {
  ctx: any;
  app: any;
  config: any;
  services: any;
  controllers: any;
  libs: any;
}

/** @deprecated use `IBaseFrameworkDefine` instead */
export interface IBaseContextDefine extends IBaseFrameworkDefine {}

/**
 * ## astroboy框架扩展的ctx定义
 * - 不包含plugins
 *
 * @author Big Mogician
 * @export
 * @interface IAstroboyCtxExtends
 * @extends {IAstroboyAppExtends<CONF>}
 * @template CONF
 * @template APP
 */
export interface IAstroboyCtxExtends<DEFINE extends Partial<IBaseFrameworkDefine> = IBaseFrameworkDefine> {
  /**
   * ### Get Config
   *
   * @author Big Mogician
   * @returns {DEFINE['config']}
   * @memberof IAstroboyCtxExtends
   */
  getConfig(): DEFINE['config'];
  /**
   * ### Get Config By Key
   *
   * @author Big Mogician
   * @template K
   * @param {K} key
   * @returns {DEFINE['config'][K]}
   * @memberof IAstroboyCtxExtends
   */
  getConfig<K extends keyof DEFINE['config']>(key: K): DEFINE['config'][K];
  /**
   * ### Get Lib
   *
   * @author Big Mogician
   * @template PkgName
   * @template LibName
   * @template LibMethods
   * @param {PkgName} pkgName
   * @param {LibName} libName
   * @returns {LibMethods}
   * @memberof IAstroboyCtxExtends
   */
  getLib<
    PkgName extends keyof DEFINE['libs'],
    LibName extends keyof DEFINE['libs'][PkgName],
    LibMethods extends DEFINE['libs'][PkgName][LibName]
  >(
    pkgName: PkgName,
    libName: LibName
  ): LibMethods;
  /**
   * ### Get Service Class
   *
   * @author Big Mogician
   * @template PkgName
   * @template ServiceName
   * @template ServiceClass
   * @param {PkgName} pkgName
   * @param {ServiceName} serviceName
   * @returns {ServiceClass}
   * @memberof IAstroboyCtxExtends
   */
  getServiceClass<
    PkgName extends keyof DEFINE['services'],
    ServiceName extends keyof DEFINE['services'][PkgName],
    ServiceClass extends DEFINE['services'][PkgName][ServiceName]
  >(
    pkgName: PkgName,
    serviceName: ServiceName
  ): ServiceClass;
  /**
   * ### Get Service Instance
   *
   * @author Big Mogician
   * @template PkgName
   * @template ServiceName
   * @template ServiceInstance
   * @param {PkgName} pkgName
   * @param {ServiceName} serviceName
   * @returns {ServiceInstance}
   * @memberof IAstroboyCtxExtends
   */
  getService<
    PkgName extends keyof DEFINE['services'],
    ServiceName extends keyof DEFINE['services'][PkgName],
    ServiceInstance extends InstanceType<DEFINE['services'][PkgName][ServiceName]>
  >(
    pkgName: PkgName,
    serviceName: ServiceName
  ): ServiceInstance;
  /**
   * ### Call Service Method Directly
   *
   * @author Big Mogician
   * @param {string} service
   * @param {string} method
   * @param {...any[]} args
   * @returns {Promise<any>}
   * @memberof IAstroboyCtxExtends
   */
  callService(service: string, method: string, ...args: any[]): Promise<any>;
  callService(method: string, ...args: any[]): Promise<any>;
  /**
   * ### Invoke Service Method Directly And Use The Return Values
   *
   * @author Big Mogician
   * @template PkgName
   * @template ServiceName
   * @template MethodName
   * @template MethodArgs
   * @template Result
   * @param {PkgName} pkgName
   * @param {ServiceName} serviceName
   * @param {MethodName} methodName
   * @param {...MethodArgs} args
   * @returns {Result}
   * @memberof IAstroboyCtxExtends
   */
  invokeServiceMethod<
    PkgName extends keyof DEFINE['services'],
    ServiceName extends keyof DEFINE['services'][PkgName],
    MethodName extends Exclude<keyof InstanceType<DEFINE['services'][PkgName][ServiceName]>, keyof IServiceProtected>,
    MethodArgs extends IArgumentsExtractor<InstanceType<DEFINE['services'][PkgName][ServiceName]>[MethodName]>,
    Result extends ReturnAnyType<InstanceType<DEFINE['services'][PkgName][ServiceName]>[MethodName]>
  >(
    pkgName: PkgName,
    serviceName: ServiceName,
    methodName: MethodName,
    ...args: MethodArgs
  ): Result;
}

/**
 * ## 纯粹的astroboy框架ctx定义
 * - 不含plugins部分
 *
 * @author Big Mogician
 * @export
 * @interface IPureAstroboyContext
 * @extends {IAstroboyCtxExtends<CONF, APP>}
 * @extends {IBaseContext<CONF, APP>}
 * @template CONF
 * @template APP
 */
export interface IPureAstroboyContext<DEFINE extends Partial<IBaseFrameworkDefine> = IBaseFrameworkDefine>
  extends IAstroboyCtxExtends<DEFINE>,
    IBaseContext<DEFINE['config'], DEFINE['app']> {}
