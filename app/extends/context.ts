/**
 * 扩展 Koa Context 对象
 */
import assert = require('assert');
import { IAstroboyApplication } from '../../definitions/extends/app';
import { IAstroboyContext, IAstroboyCtxExtends } from '../../definitions/extends/context';
import { IInnerApplication } from '../../definitions/core';

const ctxExtends: IAstroboyCtxExtends<any, IAstroboyApplication> = {
  getConfig(this: IAstroboyContext<any, any>, ...args: any[]) {
    return this.app.getConfig(...args);
  },

  getServiceClass(this: IAstroboyContext<any, IAstroboyApplication>, ...args) {
    return this.app.getServiceClass(...args);
  },

  getService(this: IAstroboyContext<any, IInnerApplication>, packageName, serviceName) {
    assert(packageName, 'Package name cannot be empty!');
    assert(serviceName, 'Service name cannot be empty!');
    if (this.app.services && this.app.services[packageName] && this.app.services[packageName][serviceName]) {
      const ServiceClass = this.app.services[packageName][serviceName];
      return new ServiceClass(this);
    } else {
      throw new Error(`Service ${packageName} ${serviceName} is not found.`);
    }
  },

  async callService(this: IAstroboyContext<any, IInnerApplication>, service: string, method: string, ...args: any[]) {
    const keys = service.split('/');
    let packageName: string = undefined!;
    let serviceName: string = undefined!;
    if (keys.length === 2) {
      packageName = keys[0];
      serviceName = keys[1];
    } else if (keys.length === 1) {
      packageName = this.app.ROOT_NAME;
      serviceName = keys[0];
    }
    if (this.app.services && this.app.services[packageName] && this.app.services[packageName][serviceName]) {
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

  async invokeServiceMethod(this: IAstroboyContext<any, IInnerApplication>, pkgName, serviceName, methodName, ...args) {
    if (this.app.services && this.app.services[pkgName] && this.app.services[pkgName][serviceName]) {
      const ServiceClass = this.app.services[pkgName][serviceName];
      const service = new ServiceClass(this);
      if (service[methodName]) {
        return await service[methodName](...args);
      } else {
        throw new Error(`method name ${methodName} is not found.`);
      }
    } else {
      throw new Error(`Service ${pkgName} ${serviceName} is not found.`);
    }
  },

  getLib(this: IAstroboyContext<any, IAstroboyApplication>, ...args) {
    return this.app.getLib(...args);
  },
};

export = ctxExtends;
