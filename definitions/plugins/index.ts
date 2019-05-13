import { IAstroboyBodyPluginMiddlewareExtends } from '../../plugins/astroboy-body/contract';
import { IAstroboyRouterPluginMiddlewareExtends } from '../../plugins/astroboy-router/contract';
import { IAstroboySecurityPluginMiddlewareExtends } from '../../plugins/astroboy-security/contract';
import { IAstroboyStaticPluginMiddlewareExtends } from '../../plugins/astroboy-static/contract';
import {
  IAstroboyViewPluginAppExtends,
  IAstroboyViewPluginCtxExtends,
  IAstroboyViewPluginConfigExtends,
} from '../../plugins/astroboy-view/contract';

export interface IAstroboyPluginAppMixins extends IAstroboyViewPluginAppExtends {}

export interface IAstroboyPluginCtxMixins extends IAstroboyViewPluginCtxExtends {}

export interface IAstroboyPluginConfigMixins extends IAstroboyViewPluginConfigExtends {}

export interface IAstroboyPluginMiddlewareMixins
  extends IAstroboyBodyPluginMiddlewareExtends,
    IAstroboyRouterPluginMiddlewareExtends,
    IAstroboySecurityPluginMiddlewareExtends,
    IAstroboyStaticPluginMiddlewareExtends {}

export interface IAstroboyPluginRegisterMixins {}
