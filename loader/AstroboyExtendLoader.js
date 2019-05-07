'use strict';
const requestProto = require('koa/lib/request');
const responseProto = require('koa/lib/response');
const contextProto = require('koa/lib/context');
const applicationProto = require('koa/lib/application').prototype;
const completeAssign = require('complete-assign');
const Loader = require('../core/Loader');

class AstroboyExtendLoader extends Loader {
  load() {
    // application extend
    this.globDirs(this.config.applicationPattern, entries => {
      entries.forEach(entry => {
        completeAssign(applicationProto, require(entry));
      });
    });

    // context extend
    this.globDirs(this.config.contextPattern, entries => {
      entries.forEach(entry => {
        completeAssign(contextProto, require(entry));
      });
    });

    // request extend
    this.globDirs(this.config.requestPattern, entries => {
      entries.forEach(entry => {
        completeAssign(requestProto, require(entry));
      });
    });

    // response extend
    this.globDirs(this.config.responsePattern, entries => {
      entries.forEach(entry => {
        completeAssign(responseProto, require(entry));
      });
    });
  }
}

module.exports = AstroboyExtendLoader;
