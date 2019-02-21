/**
 * 配置加载器加载顺序
 */
const SUPPORT_EXT = '(js|ts)';

module.exports = {
  AstroboyPkgLoader: {
    priority: 10,
  },
  AstroboyExtendLoader: {
    priority: 15,
    options: {
      applicationPattern: `/app/extends/application.${SUPPORT_EXT}`,
      contextPattern: [`/app/extends/context/*.${SUPPORT_EXT}`, `/app/extends/context.${SUPPORT_EXT}`],
      requestPattern: `/app/extends/request.${SUPPORT_EXT}`,
      responsePattern: `/app/extends/response.${SUPPORT_EXT}`,
    },
  },
  AstroboyConfigLoader: {
    priority: 20,
  },
  AstroboyMiddlewareLoader: {
    priority: 25,
  },
  AstroboyLibLoader: {
    priority: 30,
  },
  AstroboyBootLoader: {
    priority: 35,
  },
  AstroboyControllerLoader: {
    priority: 40,
    options: {
      pattern: `/app/controllers/**/*.${SUPPORT_EXT}`,
    },
  },
  AstroboyServiceLoader: {
    priority: 45,
    options: {
      pattern: `/app/services/**/*.${SUPPORT_EXT}`,
    },
  },
  AstroboyRouterLoader: {
    priority: 50,
    options: {
      pattern: `/app/routers/**/*.${SUPPORT_EXT}`,
    },
  },
  AstroboyVersionFileLoader: {
    priority: 55,
    options: {
      pattern: '/config/version*.json',
    },
  },
};
