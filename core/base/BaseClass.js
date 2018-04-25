/**
 * ctx Context 请求上下文对象
 * app Koa Application 实例对象
 * config 应用配置对象
 */
class BaseClass {
  constructor(ctx) {
    this.ctx = ctx;
    this.app = ctx && ctx.app;
    this.config = ctx && ctx.app && ctx.app.config;
  }

  getConfig(...args) {
    return this.ctx.getConfig(...args);
  }

  getServiceClass(...args) {
    return this.ctx.getServiceClass(...args);
  }

  getService(...args) {
    return this.ctx.getService(...args);
  }

  getLib(...args) {
    return this.ctx.getLib(...args);
  }

}

module.exports = BaseClass;