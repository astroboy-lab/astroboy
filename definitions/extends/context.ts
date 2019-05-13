import { PureObject, IBaseApplication, IBaseContext } from '../core';
import { IAstroboyAppExtends } from './app';

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
export interface IAstroboyCtxExtends<CONF extends PureObject = PureObject, APP extends any = IBaseApplication<CONF>>
  extends IAstroboyAppExtends<CONF> {
  /**
   * 获取一个 Service 类实例
   * @param {String} packageName 包名
   * @param {String} serviceName 服务名
   */
  getService(packageName: string, serviceName: string): any;

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
   * @param {String} pkgName 包名
   * @param {String} serviceName 服务名
   * @param {String} methodName 方法名
   * @param {Object} args 参数
   */
  invokeServiceMethod(pkgName: string, serviceName: string, methodName: string, ...args: any[]): Promise<any>;
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
export interface IPureAstroboyContext<
  CONF extends PureObject = {},
  APP extends IBaseApplication = IBaseApplication<CONF>
> extends IAstroboyCtxExtends<CONF, APP>, IBaseContext<CONF, APP> {}
