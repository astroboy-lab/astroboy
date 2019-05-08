import { PureObject, IBaseApplication } from './core';

import {
  IAstroboyPluginMiddlewareMixins,
  IAstroboyPluginConfigMixins,
  IAstroboyPluginRegisterMixins,
  IAstroboyPluginAppMixins,
  IAstroboyPluginCtxMixins,
} from './plugins';
import { IBaseMiddlewareConfig, IBaseProjectConfig, IBasePluginConfig } from './config';
import { IAstroboyCtxExtends } from './extends/context';
import { IAstroboyAppExtends } from './extends/app';

export {
  IBaseApplication,
  IBaseContext,
  PureObject,
  MiddlewareFactory,
  NormalizedMiddleware,
  PriorityDefine,
  IPathMatchOptions,
  IPathIgnoreOptions,
  PathIgnoreOptions,
} from './core';
export {
  IBaseLoaderConfig,
  IBasePluginConfig,
  IBaseMiddlewareConfig,
  IPluginOptions,
  IPriorityOptions,
} from './config';
export * from './base';

export interface IAstroboyApplication<CONFIG extends any = PureObject>
  extends IAstroboyPluginAppMixins,
    IAstroboyAppExtends<CONFIG> {}
export interface IAstroboyContext<CONFIG extends any = PureObject, A extends any = IBaseApplication<CONFIG>>
  extends IAstroboyPluginCtxMixins,
    IAstroboyCtxExtends<CONFIG, A> {}
export interface IAstroboyConfigs extends IAstroboyPluginConfigMixins, IBaseProjectConfig {}
export interface IAstroboyPlugins extends IAstroboyPluginRegisterMixins, IBasePluginConfig {}
export interface IAstroboyMiddlewares extends IAstroboyPluginMiddlewareMixins, IBaseMiddlewareConfig {}
