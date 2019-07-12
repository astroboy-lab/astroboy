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

export interface IBaseContextDefine {
  ctx: any;
  app: any;
  config: any;
  services: any;
  controllers: any;
  libs: any;
}

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
export interface IAstroboyCtxExtends<DEFINE extends Partial<IBaseContextDefine> = IBaseContextDefine> {
  /**
   * @description 获取完成配置字典
   */
  getConfig(): DEFINE['config'];

  /**
   * @description 获取具体某个 config 字段的值
   * @template K keyod key
   * @param {string} key
   */
  getConfig<K extends keyof DEFINE['config']>(key: K): DEFINE['config'][K];

  /**
   * @description 获取某个具体的 Lib 函数
   * @template PkgName 字符串包名
   * @template LibName 字符串 Lib 函数名
   * @template LibFunction 某个具体 Lib 函数
   * @param {PkgName} pkgName
   * @param {LibName} libName
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
   * @description 获取某个 Service 的构造函数
   * @template PkgName 字符串包名
   * @template ServiceName 字符串类名
   * @template ServiceClass 具体某个 Service 构造函数
   * @param {PkgName} pkgName
   * @param {ServiceName} serviceName
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
   * 获取一个 Service 类实例
   * @template PkgName 字符串包名
   * @template ServiceName 字符串类名
   * @template ServiceInstance 具体某个 Service 的实例
   * @param {String} packageName 包名
   * @param {String} serviceName 服务名
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
   * 调用服务
   * @param {String} service 服务名
   * @param {String} method 方法名
   * @param {Object} args 参数
   */
  callService(service: string, method: string, ...args: any[]): Promise<any>;
  callService(method: string, ...args: any[]): Promise<any>;

  /**
   * 调用服务(定义支持)
   * @template PkgName 字符串包名
   * @template ServiceName 字符串类名
   * @template MethodName 具体某个 Service 的某个方法名
   * @template MethodArgs 具体某个 Service 的某个方法名的参数
   * @template Result 具体某个 Service 的某个方法的返回类型
   * @param {String} pkgName 包名
   * @param {String} serviceName 服务名
   * @param {String} methodName 方法名
   * @param {Object} args 参数
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
export interface IPureAstroboyContext<DEFINE extends Partial<IBaseContextDefine> = IBaseContextDefine>
  extends IAstroboyCtxExtends<DEFINE>,
    IBaseContext<DEFINE['config'], DEFINE['app']> {}
