import { PureObject, IBaseApplication } from '../core';

export interface IAstroboyAppExtends<CONF extends PureObject = PureObject> {
  /**
   * 获取配置信息，参数 key 可以是点分隔符隔开的字符串，例如 foo.bar
   * @param {String} key 配置 key
   */
  getConfig(): CONF;
  getConfig<K extends keyof CONF>(key: K): CONF[K];

  /**
   * 获取 Service 类
   * @param {String} packageName 包名
   * @param {String} serviceName 服务名
   */
  getServiceClass(packageName: string, serviceName: string): any;

  getLib(packageName: string, libName: string): any;
}

export interface IAstroboyApplication<CONF extends PureObject = {}>
  extends IAstroboyAppExtends<CONF & PureObject>,
    IBaseApplication<CONF & PureObject> {}
