/**
 * 请求体解析中间件
 */
const koaBody = require('koa-body');

module.exports = (options, app) => {
	let fn = koaBody(options);
	fn._name = 'body';
	return fn;
};