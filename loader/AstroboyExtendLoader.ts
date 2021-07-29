
import { Loader } from '../core/Loader';
import { IInnerApplication } from '../definitions/core';
import { IOptions } from '../definitions/config';
import { BaseClass } from '../core/base/BaseClass';

const requestProto = require('koa/lib/request');
const responseProto = require('koa/lib/response');
const contextProto = require('koa/lib/context');
const applicationProto = require('koa/lib/application').prototype;

const completeAssign = require('complete-assign');


import {
  request as mockRequest,
  response as mockResponse,
  context as mockContext,
} from '../core/lib/mockKoa';

class AstroboyExtendLoader extends Loader<Partial<IOptions>, IInnerApplication<Partial<IOptions>>> {
  async load() {
    // application extend
    const applicationEntries = await this.globDirs(this.config.applicationPattern || []);
    applicationEntries.forEach(entry => {
      if (this.app.MODE_AE) {
        completeAssign(this.app, require(entry as string));
      } else {
        completeAssign(applicationProto, require(entry as string));
      }
    });
    // context extend
    const contextEntries = await this.globDirs(this.config.contextPattern || []);
    contextEntries.forEach(entry => {
      if (this.app.MODE_AE) {
        completeAssign(mockContext, require(entry as string));
      } else {
        completeAssign(contextProto, require(entry as string));
      }
    });
    // request extend
    const requestEntries = await this.globDirs(this.config.requestPattern || []);
    requestEntries.forEach(entry => {
      if (this.app.MODE_AE) {
        completeAssign(mockRequest, require(entry as string));
      } else {
        completeAssign(requestProto, require(entry as string));
      }
    });

    // response extend
    const responseEntries = await this.globDirs(this.config.responsePattern || []);
    responseEntries.forEach(entry => {
      if (this.app.MODE_AE) {
        completeAssign(mockResponse, require(entry as string));
      } else {
        completeAssign(responseProto, require(entry as string));
      }
    });
    // controller extend
    const controllerEntries = await this.globDirs(this.config.controllerPattern || []);
    controllerEntries.forEach(entry => {
      completeAssign(BaseClass.prototype, require(entry as string));
    });
  }
}

export = AstroboyExtendLoader;
