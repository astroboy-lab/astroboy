import { PathIgnoreOptions } from './core';

export interface IPriority {
  priority: number;
}

export interface IOptions {
  pattern: string | string[];
  configPattern: string | string[];
  applicationPattern: string | string[];
  contextPattern: string | string[];
  requestPattern: string | string[];
  responsePattern: string | string[];
  controllerPattern: string | string[];
}

export interface IPriorityOptions extends IPriority {
  options?: Partial<IOptions>;
}

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
}

export interface IPluginOptions {
  enable: boolean;
  path?: string;
}

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
