import { PathIgnoreOptions } from './core';

/**
 * ## 优先级配置项
 *
 * @author Big Mogician
 * @export
 * @interface IPriority
 */
export interface IPriority {
  priority: number;
}

/**
 * ## 配置Pattern参数组
 *
 * @author Big Mogician
 * @export
 * @interface IOptions
 */
export interface IOptions {
  pattern: string | string[];
  configPattern: string | string[];
  applicationPattern: string | string[];
  contextPattern: string | string[];
  requestPattern: string | string[];
  responsePattern: string | string[];
  controllerPattern: string | string[];
}

/**
 * ## 中间件默认配置
 *
 * @author Big Mogician
 * @export
 * @interface IPriorityOptions
 * @extends {IPriority}
 */
export interface IPriorityOptions extends IPriority {
  options?: Partial<IOptions>;
}

/**
 * ## Base Framework Loaders Config
 *
 * @author Big Mogician
 * @export
 * @interface IBaseLoaderConfig
 */
export interface IBaseLoaderConfig {
  AstroboyPkgLoader: IPriorityOptions;
  AstroboyExtendLoader: IPriorityOptions;
  AstroboyConfigLoader: IPriorityOptions;
  AstroboyMiddlewareLoader: IPriorityOptions;
  AstroboyLibLoader: IPriorityOptions;
  AstroboyBootLoader: IPriorityOptions;
  AstroboyControllerLoader: IPriorityOptions;
  AstroboyServiceLoader: IPriorityOptions;
  AstroboyRouterLoader: IPriorityOptions;
  AstroboyVersionFileLoader: IPriorityOptions;
  AstroboyFnLoader: IPriorityOptions;
}

/**
 * ## 插件配置
 *
 * @author Big Mogician
 * @export
 * @interface IPluginOptions
 */
export interface IPluginOptions {
  enable: boolean;
  path?: string;
  package?: string;
}

/**
 * ## Base Framework Plugins Config
 *
 * @author Big Mogician
 * @export
 * @interface IBasePluginConfig
 */
export interface IBasePluginConfig {
  'astroboy-body': IPluginOptions;
  'astroboy-router': IPluginOptions;
  'astroboy-security': IPluginOptions;
  'astroboy-static': IPluginOptions;
  'astroboy-view': IPluginOptions;
}

export type IMiddlewareOptions<OPT = any> = PathIgnoreOptions<OPT> & {
  enable?: boolean;
  priority?: number;
};

export interface IBaseMiddlewareConfig {}

export interface IBaseProjectConfig {}
