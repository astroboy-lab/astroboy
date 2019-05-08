import { IAstroboyBodyPluginMiddlewareExtends } from './astroboy-body/middleware';
import { IAstroboyRouterPluginMiddlewareExtends } from './astroboy-router/middleware';
import { IAstroboySecurityPluginMiddlewareExtends } from './astroboy-security/middleware';
import { IAstroboyStaticPluginMiddlewareExtends } from './astroboy-static/middleware';
import { IAstroboyViewPluginAppExtends } from './astroboy-view/app';
import { IAstroboyViewPluginCtxExtends } from './astroboy-view/context';
import { IAstroboyViewPluginConfigExtends } from './astroboy-view/config';

export interface IAstroboyPluginAppMixins extends IAstroboyViewPluginAppExtends {}

export interface IAstroboyPluginCtxMixins extends IAstroboyViewPluginCtxExtends {}

export interface IAstroboyPluginConfigMixins extends IAstroboyViewPluginConfigExtends {}

export interface IAstroboyPluginMiddlewareMixins
  extends IAstroboyBodyPluginMiddlewareExtends,
    IAstroboyRouterPluginMiddlewareExtends,
    IAstroboySecurityPluginMiddlewareExtends,
    IAstroboyStaticPluginMiddlewareExtends {}

export interface IAstroboyPluginRegisterMixins {}
