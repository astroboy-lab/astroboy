const lodash = require('lodash');
const xss = require("xss");

function deepXss(value, deep = true) {
  let res;

  if (Array.isArray(value) && value.length > 0) {
    res = [];
  } else if (lodash.isPlainObject(value) && Object.keys(value).length > 0) {
    res = {};
  } else {
    if (typeof value === 'string') {
      return xss(value);
    }
    return value;
  }

  return lodash.reduce(value, (result, val, key) => {
    if (deep) {
      val = deepXss(val);
    }
    result[key] = val;
    return result;
  }, res);
}

module.exports = (options, app) => {
  return async function xss(ctx, next) {
    ctx.query = deepXss(ctx.query);
    ctx.request.body = deepXss(ctx.request.body);
    await next();
  };

};