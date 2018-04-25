/**
 * 设置 X-Node-Engine 响应头，示例：Astroboy-0.0.1
 */
module.exports = (options, app) => {
  return async function meta(ctx, next) {
    await next();
    ctx.set('X-Node-Engine', `Astroboy-${ctx.app.pkg.version}`);
  };
};