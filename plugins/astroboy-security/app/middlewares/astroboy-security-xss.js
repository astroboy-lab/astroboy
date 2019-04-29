const lodash = require('lodash');
const xss = require("xss");

function deepXss(value, ignoreKey = [], handler = () => {
}) {
  let res;

  if (Array.isArray(value) && value.length > 0) {
    res = [];
  } else if (lodash.isPlainObject(value) && Object.keys(value).length > 0) {
    res = {};
  } else {
    if (typeof value === 'string') {
      return handler(value);
    }
    return value;
  }

  return lodash.reduce(value, (result, val, key) => {
    if (Array.isArray(ignoreKey) && ignoreKey.length && ignoreKey.indexOf(key) !== -1) {
      result[key] = val;
    } else {
      result[key] = deepXss(val, ignoreKey, handler);
    }
    return result;
  }, res);
}

module.exports = (options, app) => {
  let {
    special,
    whiteListParamKey = [],
    whiteListTagAndAttr = [],
    /**
     // tag是当前的标签名称，比如<a>标签，则tag的值是'a'
     // html是该标签的HTML，比如<a>标签，则html的值是'<a>'
     // options是一些附加的信息，具体如下：
     //   isWhite    boolean类型，表示该标签是否在白名单上
     //   isClosing  boolean类型，表示该标签是否为闭合标签，比如</a>时为true
     //   position        integer类型，表示当前标签在输出的结果中的起始位置
     //   sourcePosition  integer类型，表示当前标签在原HTML中的起始位置
     // 如果返回一个字符串，则当前标签将被替换为该字符串
     */
    onTag = (tag, html, options) => {},

    /**
     // tag是当前的标签名称，比如<a>标签，则tag的值是'a'
     // name是当前属性的名称，比如href="#"，则name的值是'href'
     // value是当前属性的值，比如href="#"，则value的值是'#'
     // isWhiteAttr是否为白名单上的属性
     // 如果返回一个字符串，则当前属性值将被替换为该字符串
     */
    onTagAttr = (tag, name, value, isWhiteAttr) => {}
  } = options || {};

  return async function (ctx, next) {
    const _options = {};
    let _whiteListParamKey = whiteListParamKey;

    // 拼装接口特殊配置
    if (Array.isArray(special)) {
      for (let i = 0, len = special.length; i < len; i++) {
        if (special[i].urls.indexOf(ctx.path) !== -1) {
          if (special[i].whiteListParamKey) {
            _whiteListParamKey = special[i].whiteListParamKey;
          }
          if (special[i].whiteListTagAndAttr) {
            _options.whiteList = Object.assign({}, xss.whiteList, whiteListTagAndAttr, special[i].whiteListTagAndAttr);
          }
          if (special[i].onTag) {
            _options.onTag = special[i].onTag;
          }
          if (special[i].onTagAttr) {
            _options.onTagAttr = special[i].onTagAttr;
          }
          break;
        }
      }
    }

    // 拼装项目配置
    if (!_options.whiteList && Object.keys(whiteListTagAndAttr).length) {
      _options.whiteList = Object.assign({}, xss.whiteList, whiteListTagAndAttr);
    }
    if (!_options.onTag && onTag) {
      _options.onTag = onTag;
    }
    if (!_options.onTagAttr && onTagAttr) {
      _options.onTagAttr = onTagAttr;
    }

    const _xss = new xss.FilterXSS(_options);

    // 处理 url 查询字串
    ctx.query = deepXss(ctx.query, _whiteListParamKey, xssStr => {
      return _xss.process(xssStr);
    });
    // 处理 post 请求体
    ctx.request.body = deepXss(ctx.request.body, _whiteListParamKey, xssStr => {
      return _xss.process(xssStr);
    });
    await next();
  };

};
