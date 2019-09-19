import * as path from 'path';
import { IAstroboyViewPluginConfigExtends } from '../contract';

const config: (app: any) => IAstroboyViewPluginConfigExtends = app => {
  return {
    view: {
      root: path.join(app.ROOT_PATH, 'app/views'),
      cache: true,
      defaultExtension: '.html',
      defaultViewEngine: '',
      mapping: {},
    },
  };
};

export = config;
