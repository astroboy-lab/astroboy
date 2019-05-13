import * as path from 'path';
import { IAstroboyStaticPluginMiddlewareExtends } from '../contract';

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
