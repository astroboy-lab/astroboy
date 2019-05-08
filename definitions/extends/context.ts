import { PureObject, IBaseApplication, IBaseContext } from '../core';
import { IAstroboyAppExtends } from './app';

export interface IAstroboyCtxExtends<
  CONF extends PureObject = PureObject,
  APP extends IBaseApplication = IBaseApplication<CONF>
> extends IAstroboyAppExtends<CONF> {
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

export interface IAstroboyContext<CONF extends PureObject = {}, APP extends IBaseApplication = IBaseApplication<CONF>>
  extends IAstroboyCtxExtends<CONF & PureObject, APP & IBaseApplication<CONF>>,
    IBaseContext<CONF & PureObject, APP & IBaseApplication<CONF>> {}
