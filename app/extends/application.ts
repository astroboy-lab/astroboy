/**
 * 扩展 Koa Application 对象
 */
import assert = require('assert');

import { IAstroboyAppExtends, IPureAstroboyApplication } from '../../definitions/extends/app';
import { IInnerApplication } from '../../definitions/core';

const appExtends: IAstroboyAppExtends = {
  getConfig(this: IPureAstroboyApplication<any>, key?: string) {
    if (!key) {
      return this.config;
    } else {
      let keys = key.split('.');
      let result = this.config;
      let item;
      while ((item = keys.shift())) {
        result = result[item];
      }
      return result;
    }
  },

  getServiceClass(this: IInnerApplication, packageName, serviceName) {
    assert(packageName, 'Package name cannot be empty!');
    assert(serviceName, 'Service name cannot be empty!');
    if (this.services && this.services[packageName] && this.services[packageName][serviceName]) {
      return this.services[packageName][serviceName];
    } else {
      throw new Error(`Service ${packageName} ${serviceName} is not found.`);
    }
  },

  getLib(this: IInnerApplication, packageName, libName) {
    assert(packageName, 'Package name cannot be empty!');
    assert(libName, 'Lib name cannot be empty!');
    if (this.libs && this.libs[packageName] && this.libs[packageName][libName]) {
      return this.libs[packageName][libName];
    } else {
      throw new Error(`Lib ${packageName} ${libName} is not found.`);
    }
  },
};

export = appExtends;
