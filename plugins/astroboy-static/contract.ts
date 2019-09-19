import { IMiddlewareOptions } from '../../definitions/config';

export interface IAstroboyStaticPluginMiddlewareExtends {
  'astroboy-static': IMiddlewareOptions<{ root?: string }>;
}
