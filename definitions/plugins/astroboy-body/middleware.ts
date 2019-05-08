import { IMiddlewareOptions } from '../../config';

export interface IAstroboyBodyPluginMiddlewareExtends {
  'astroboy-body': IMiddlewareOptions<{
    formidable?: {
      uploadDir?: string;
    };
    multipart?: boolean;
    jsonLimit?: string;
    formLimit?: string;
    textLimit?: string;
    strict?: boolean;
  }>;
}
