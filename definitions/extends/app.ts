import { PureObject, IBaseApplication } from '../core';

/**
 * ## astroboy框架扩展的ctx定义
 * - 不包含plugins
 *
 * @author Big Mogician
 * @export
 * @interface IAstroboyAppExtends
 * @template CONF
 */
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

/**
 * ## 纯粹的astroboy框架app定义
 * - 不含plugins部分
 *
 * @author Big Mogician
 * @export
 * @interface IPureAstroboyApplication
 * @extends {IAstroboyAppExtends<CONF>}
 * @extends {IBaseApplication<CONF>}
 * @template CONF
 */
export interface IPureAstroboyApplication<CONF extends PureObject = {}>
  extends IAstroboyAppExtends<CONF>,
    IBaseApplication<CONF> {}
