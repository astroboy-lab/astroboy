import { IMiddlewareOptions } from '../../definitions/config';

export interface IOptions {
  parser: string;
  multipart: boolean;
  jsonLimit: string;
  formLimit: string;
  textLimit: string;
  strict: boolean;
  formidable: {
    uploadDir?: string;
  };
}

export interface IAstroboyBodyPluginMiddlewareExtends {
  'astroboy-body': IMiddlewareOptions<Partial<IOptions>>;
}
