/**
 * 请求体解析中间件
 */
const koaBody = require('koa-body');
const bodyParser = require('koa-bodyparser');

module.exports = (options, app) => {
	let fn = options.parser === 'koa-bodyparser' ? bodyParser(options) : koaBody(options);
	fn._name = 'body';
	return fn;
};