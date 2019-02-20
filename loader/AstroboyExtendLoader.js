'use strict';
const requestProto = require('koa/lib/request');
const responseProto = require('koa/lib/response');
const contextProto = require('koa/lib/context');
const applicationProto = require('koa/lib/application').prototype;
const completeAssign = require('complete-assign');
const Loader = require('../core/Loader');

class AstroboyExtendLoader extends Loader {
  load(dirs, options = {}, app) {
    
  }
}

module.exports = AstroboyExtendLoader;
