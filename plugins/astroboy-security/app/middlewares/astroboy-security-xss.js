const lodash = require('lodash');
const xss = require('xss');

module.exports = (options, app) => {
  const myxss = new xss.FilterXSS(options);
  const deepXss = function(value, deep = true) {
    let res;

    if (Array.isArray(value) && value.length > 0) {
      res = [];
    } else if (lodash.isPlainObject(value) && Object.keys(value).length > 0) {
      res = {};
    } else {
      if (typeof value === 'string') {
        return myxss.process(value.trim());
      }
      return value;
    }

    return lodash.reduce(
      value,
      (result, val, key) => {
        if (deep) {
          val = deepXss(val);
        }
        result[key] = val;
        return result;
      },
      res
    );
  };

  return function xss(ctx, next) {
    ctx.query = deepXss(ctx.query);
    ctx.request.body = deepXss(ctx.request.body);
    return next();
  };
};
