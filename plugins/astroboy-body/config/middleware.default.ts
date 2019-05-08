import { IAstroboyBodyPluginMiddlewareExtends } from '../../../definitions/plugins/astroboy-body/middleware';

import path = require('path');

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
