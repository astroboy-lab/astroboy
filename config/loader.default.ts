import { IBaseLoaderConfig } from '../definitions/config';

/**
 * 配置加载器加载顺序
 */
const SUPPORT_EXT = '(js|ts)';
const NODE_ENV = process.env.NODE_ENV;

const defaultLoaderConfig: IBaseLoaderConfig = {
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
    options: {
      // 注意：为了控制配置合并顺序，不要这么写 `/config/config.(default|${NODE_ENV}).js`
      pattern: [`/config/config.default.${SUPPORT_EXT}`, `/config/config.${NODE_ENV}.${SUPPORT_EXT}`],
    },
  },
  AstroboyMiddlewareLoader: {
    priority: 25,
    options: {
      pattern: `/app/middlewares/*.${SUPPORT_EXT}`,
      // 注意：为了控制配置合并顺序，不要这么写 `/config/config.(default|${NODE_ENV}).js`
      configPattern: [`/config/middleware.default.${SUPPORT_EXT}`, `/config/middleware.${NODE_ENV}.${SUPPORT_EXT}`],
    },
  },
  AstroboyLibLoader: {
    priority: 30,
    options: {
      pattern: `/app/lib/*.${SUPPORT_EXT}`,
    },
  },
  AstroboyBootLoader: {
    priority: 35,
    options: {
      pattern: `/boot.${SUPPORT_EXT}`,
    },
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

export = defaultLoaderConfig;
