import { PureObject, IBaseContext } from './core';

import {
  IAstroboyPluginMiddlewareMixins,
  IAstroboyPluginConfigMixins,
  IAstroboyPluginRegisterMixins,
  IAstroboyPluginAppMixins,
  IAstroboyPluginCtxMixins,
} from './plugins';
import { IBaseMiddlewareConfig, IBaseProjectConfig, IBasePluginConfig } from './config';
import { IPureAstroboyContext, IBaseFrameworkDefine } from './extends/context';
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
 * @interface IAstroboyBootstrapOptions
 * @extends {BootstrapOptions}
 */
export interface IAstroboyBootstrapOptions extends BootstrapOptions {}
/** @deprecated use `IAstroboyBootstrapOptions` instead */
export interface IAstroboyBootsrrapOptions extends IAstroboyBootstrapOptions {}

/**
 * ## astroboy 基础上下文扩展结构
 *
 * @author Big Mogician
 * @export
 * @interface IAstroboyFrameworkDefine
 * @extends {IBaseFrameworkDefine}
 */
export interface IAstroboyFrameworkDefine extends IBaseFrameworkDefine {
  ctx: IBaseContext;
  app: IAstroboyApplication;
  config: PureObject;
  services: {};
  controllers: {};
  libs: {};
}
/** @deprecated use `IAstroboyFrameworkDefine` instead */
export interface IAstroboyContextDefine extends IAstroboyFrameworkDefine {}

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
 * @template APP
 */
export interface IAstroboyContext<DEFINE extends Partial<IBaseFrameworkDefine> = IAstroboyFrameworkDefine>
  extends IAstroboyPluginCtxMixins,
    IPureAstroboyContext<DEFINE> {}

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
