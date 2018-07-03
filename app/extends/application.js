/**
 * 扩展 Koa Application 对象
 */
const assert = require('assert');

module.exports = {

  /**
   * 获取配置信息，参数 key 可以是点分隔符隔开的字符串，例如 foo.bar
   * @param {String} key 配置 key
   */
  getConfig(key) {
    if (!key) {
      return this.config;
    } else {
      let keys = key.split('.');
      let result = this.config;
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
    if (this.services && this.services[packageName] && this.services[packageName][serviceName]) {
      return this.services[packageName][serviceName];
    } else {
      throw new Error(`Service ${packageName} ${serviceName} is not found.`);
    }
  },

  getLib(packageName, libName) {
    assert(packageName, 'Package name cannot be empty!');
    assert(libName, 'Lib name cannot be empty!');
    if (this.libs && this.libs[packageName] && this.libs[packageName][libName]) {
      return this.libs[packageName][libName];
    } else {
      throw new Error(`Lib ${packageName} ${libName} is not found.`);
    }
  }
};