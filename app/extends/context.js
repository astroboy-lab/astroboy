/**
 * 扩展 Koa Context 对象
 */
const assert = require('assert');

module.exports = {

  /**
   * 获取配置信息，参数 key 可以是点分隔符隔开的字符串，例如 foo.bar
   * @param {String} key 配置 key
   */
  getConfig(key) {
    if (!key) {
      return this.app.config;
    } else {
      let keys = key.split('.');
      let result = this.app.config;
      let item;
      while (item = keys.shift()) {
        result = result[item];
      }
      return result;
    }
  },

  /**
   * 获取 Service 类
   * @param {String} packageName 包名
   * @param {String} serviceName 服务名
   */
  getServiceClass(packageName, serviceName) {
    assert(packageName, 'Package name cannot be empty!');
    assert(serviceName, 'Service name cannot be empty!');
    if (this.app.services
      && this.app.services[packageName]
      && this.app.services[packageName][serviceName]) {
      return this.app.services[packageName][serviceName];
    } else {
      throw new Error(`Service ${packageName} ${serviceName} is not found.`);
    }
  },

  /**
   * 获取一个 Service 类实例
   * @param {String} packageName 包名
   * @param {String} serviceName 服务名
   */
  getService(packageName, serviceName) {
    assert(packageName, 'Package name cannot be empty!');
    assert(serviceName, 'Service name cannot be empty!');
    if (this.app.services
      && this.app.services[packageName]
      && this.app.services[packageName][serviceNamename]) {
      const ServiceClass = this.app.services[packageName][serviceName];
      return new ServiceClass(this);
    } else {
      throw new Error(`Service ${packageName} ${serviceName} is not found.`);
    }
  },

  getLib(packageName, libName) {
    assert(packageName, 'Package name cannot be empty!');
    assert(libName, 'Lib name cannot be empty!');
    if (this.app.libs
      && this.app.libs[packageName]
      && this.app.libs[packageName][libName]) {
      return this.app.libs[packageName][libName];
    } else {
      throw new Error(`Lib ${packageName} ${libName} is not found.`);
    }
  }

};