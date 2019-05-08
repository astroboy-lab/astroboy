import lodash from 'lodash';
import xss = require('xss');
import { MiddlewareFactory } from '../../../../definitions';

function deepXss(value: any, deep = true) {
  let res;

  if (Array.isArray(value) && value.length > 0) {
    res = [];
  } else if (lodash.isPlainObject(value) && Object.keys(value).length > 0) {
    res = {};
  } else {
    if (typeof value === 'string') {
      return xss(value.trim());
    }
    return value;
  }

  return lodash.reduce(
    value,
    (result: any, val, key) => {
      if (deep) {
        val = deepXss(val);
      }
      result[key] = val;
      return result;
    },
    res
  );
}

const factory: MiddlewareFactory<any, any> = (options, app) => {
  return async function xss(ctx, next) {
    ctx.query = deepXss(ctx.query);
    ctx.request.body = deepXss(ctx.request.body);
    await next();
  };
};

export = factory;
