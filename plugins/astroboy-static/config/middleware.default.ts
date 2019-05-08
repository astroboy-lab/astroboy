import { IAstroboyStaticPluginMiddlewareExtends } from '../../../definitions/plugins/astroboy-static/middleware';

import * as path from 'path';

const config: IAstroboyStaticPluginMiddlewareExtends = {
  'astroboy-static': {
    priority: 3,
    enable: true,
    options: {
      root: path.resolve('/tmp/static'),
    },
  },
};

export = config;
