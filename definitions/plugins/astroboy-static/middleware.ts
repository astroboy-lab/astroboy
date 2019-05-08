import { IMiddlewareOptions } from '../../config';

export interface IAstroboyStaticPluginMiddlewareExtends {
  'astroboy-static': IMiddlewareOptions<{ root?: string }>;
}
