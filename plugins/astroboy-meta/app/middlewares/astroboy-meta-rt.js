/**
 * 设置 X-Response-Time 响应头，单位毫秒
 */
module.exports = (options, app) => {
  return async function rt(ctx, next) {
    const start = Date.now();
    await next();
    ctx.set('X-Response-Time', Date.now() - start);
  };
};