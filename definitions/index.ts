import { PureObject, IBaseApplication } from './core';

import {
  IAstroboyPluginMiddlewareMixins,
  IAstroboyPluginConfigMixins,
  IAstroboyPluginRegisterMixins,
  IAstroboyPluginAppMixins,
  IAstroboyPluginCtxMixins,
} from './plugins';
import { IBaseMiddlewareConfig, IBaseProjectConfig, IBasePluginConfig } from './config';
import { IPureAstroboyContext } from './extends/context';
import { IPureAstroboyApplication } from './extends/app';
import { IAstroboyOptions as BootstrapOptions } from './core';

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

/**
 * astroboy 框架的配置参数
 *
 * @author Big Mogician
 * @export
 * @interface IAstroboyBootsrrapOptions
 * @extends {BootstrapOptions}
 */
export interface IAstroboyBootsrrapOptions extends BootstrapOptions {}

/**
 * ## astroboy 基础app结构
 *
 * @author Big Mogician
 * @export
 * @interface IAstroboyApplication
 * @extends {IAstroboyPluginAppMixins}
 * @extends {IAstroboyAppExtends<CONFIG>}
 * @template CONFIG
 */
export interface IAstroboyApplication<CONFIG extends PureObject = PureObject>
  extends IAstroboyPluginAppMixins,
    IPureAstroboyApplication<CONFIG> {}

/**
 * astroboy 基础Ctx结构
 *
 * @author Big Mogician
 * @export
 * @interface IAstroboyContext
 * @extends {IAstroboyPluginCtxMixins}
 * @extends {IAstroboyCtxExtends<CONFIG, A>}
 * @template CONFIG
 * @template A
 */
export interface IAstroboyContext<
  CONFIG extends PureObject = PureObject,
  A extends IBaseApplication = IBaseApplication<CONFIG>
> extends IAstroboyPluginCtxMixins, IPureAstroboyContext<CONFIG, A> {}

/**
 * astroboy 基础configs结构
 *
 * @author Big Mogician
 * @export
 * @interface IAstroboyConfigs
 * @extends {IAstroboyPluginConfigMixins}
 * @extends {IBaseProjectConfig}
 */
export interface IAstroboyConfigs extends IAstroboyPluginConfigMixins, IBaseProjectConfig {}

/**
 * astroboy 基础plugins结构
 *
 * @author Big Mogician
 * @export
 * @interface IAstroboyPlugins
 * @extends {IAstroboyPluginRegisterMixins}
 * @extends {IBasePluginConfig}
 */
export interface IAstroboyPlugins extends IAstroboyPluginRegisterMixins, IBasePluginConfig {}

/**
 * astroboy 基础middlewares结构
 *
 * @author Big Mogician
 * @export
 * @interface IAstroboyMiddlewares
 * @extends {IAstroboyPluginMiddlewareMixins}
 * @extends {IBaseMiddlewareConfig}
 */
export interface IAstroboyMiddlewares extends IAstroboyPluginMiddlewareMixins, IBaseMiddlewareConfig {}
