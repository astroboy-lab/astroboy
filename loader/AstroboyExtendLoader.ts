
import { Loader } from '../core/Loader';
import { IInnerApplication } from '../definitions/core';
import { IOptions } from '../definitions/config';
import { BaseClass } from '../core/base/BaseClass';

const requestProto = require('koa/lib/request');
const responseProto = require('koa/lib/response');
const contextProto = require('koa/lib/context');
const applicationProto = require('koa/lib/application').prototype;

const completeAssign = require('complete-assign');

const {
  request: mockRequest,
  response: mockResponse,
  context: mockContext,
  application: mockApplication,
} = require('../core/lib/mockKoa');

class AstroboyExtendLoader extends Loader<Partial<IOptions>, IInnerApplication<Partial<IOptions>>> {
  load() {
    // application extend
    this.globDirs(this.config.applicationPattern || [], entries => {
      entries.forEach(entry => {
        if (this.app.MODE_AE) {
          completeAssign(this.app, require(entry as string));
          completeAssign(mockApplication, require(entry as string));
        } else {
          completeAssign(applicationProto, require(entry as string));
        }
      });
    });

    // context extend
    this.globDirs(this.config.contextPattern || [], entries => {
      entries.forEach(entry => {
        if (this.app.MODE_AE) {
          completeAssign(mockContext, require(entry as string));
        } else {
          completeAssign(contextProto, require(entry as string));
        }
      });
    });

    // request extend
    this.globDirs(this.config.requestPattern || [], entries => {
      entries.forEach(entry => {
        if (this.app.MODE_AE) {
          completeAssign(mockRequest, require(entry as string));
        } else {
          completeAssign(requestProto, require(entry as string));
        }
      });
    });

    // response extend
    this.globDirs(this.config.responsePattern || [], entries => {
      entries.forEach(entry => {
        if (this.app.MODE_AE) {
          completeAssign(mockResponse, require(entry as string));
        } else {
          completeAssign(responseProto, require(entry as string));
        }
      });
    });

    // controller extend
    this.globDirs(this.config.controllerPattern || [], entries => {
      entries.forEach(entry => {
        completeAssign(BaseClass.prototype, require(entry as string));
      });
    });
  }
}

export = AstroboyExtendLoader;
