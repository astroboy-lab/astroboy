/**
 * 扩展 Koa Context 对象
 */
const assert = require('assert');

module.exports = {

  getConfig(...args) {
    return this.app.getConfig(...args);
  },

  getServiceClass(...args) {
    return this.app.getServiceClass(...args);
  },

  /**
   * 获取一个 Service 类实例
   * @param {String} packageName 包名
   * @param {String} serviceName 服务名
   */
  getService(packageName, serviceName) {
    assert(packageName, 'Package name cannot be empty!');
    assert(serviceName, 'Service name cannot be empty!');
    if (this.app.services && this.app.services[packageName] && this.app.services[packageName][serviceName]) {
      const ServiceClass = this.app.services[packageName][serviceName];
      return new ServiceClass(this);
    } else {
      throw new Error(`Service ${packageName} ${serviceName} is not found.`);
    }
  },

  /**
   * 调用服务
   * @param {String} service 服务名
   * @param {String} method 方法名
   * @param {Object} args 参数
   */
  async callService(service, method, ...args) {
    const keys = service.split('/');
    let packageName,
      serviceName;
    if (keys.length === 2) {
      packageName = keys[0];
      serviceName = keys[1];
    } else if (keys.length === 1) {
      packageName = this.app.projectName;
      serviceName = keys[0];
    }
    if (this.app.services &&
      this.app.services[packageName] &&
      this.app.services[packageName][serviceName]) {
      const ServiceClass = this.app.services[packageName][serviceName];
      const service = new ServiceClass(this);
      if (service[method]) {
        return await service[method](...args);
      } else {
        throw new Error(`method name ${method} is not found.`);
      }
    } else {
      throw new Error(`Service ${packageName} ${serviceName} is not found.`);
    }
  },

  getLib(...args) {
    return this.app.getLib(...args);
  }

};