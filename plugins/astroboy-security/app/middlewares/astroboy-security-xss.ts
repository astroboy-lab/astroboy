import isPlainObject from 'lodash.isplainobject';
import reduce from 'lodash.reduce';
import * as xss from 'xss';
import { MiddlewareFactory } from '../../../../definitions';

const astroboySecurityXSSFactory: MiddlewareFactory<any, any> = (options, app) => {
  const myxss = new xss.FilterXSS(options);
  const deepXss = function(value: any, deep = true) {
    let res: any;

    if (Array.isArray(value) && value.length > 0) {
      res = [];
    } else if (isPlainObject(value) && Object.keys(value).length > 0) {
      res = {};
    } else {
      if (typeof value === 'string') {
        return myxss.process(value.trim());
      }
      return value;
    }

    return reduce(
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

export = astroboySecurityXSSFactory;
