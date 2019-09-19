import * as path from 'path';
import { IAstroboyBodyPluginMiddlewareExtends } from '../contract';

const config: IAstroboyBodyPluginMiddlewareExtends = {
  'astroboy-body': {
    priority: 15,
    enable: true,
    options: {
      formidable: {
        uploadDir: path.resolve('/tmp'),
      },
      multipart: true,
      jsonLimit: '3mb',
      formLimit: '3mb',
      textLimit: '3mb',
      strict: false,
    },
  },
};

export = config;
