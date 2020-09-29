import * as path from 'path';
import { IBasePluginConfig } from '../definitions/config';

/**
 * 默认插件配置文件
 */
const defaultPluginConfig: IBasePluginConfig = {
  'astroboy-body': {
    enable: true,
    path: path.resolve(__dirname, '../plugins/astroboy-body'),
  },

  'astroboy-router': {
    enable: true,
    path: path.resolve(__dirname, '../plugins/astroboy-router'),
  },

  'astroboy-security': {
    enable: true,
    path: path.resolve(__dirname, '../plugins/astroboy-security'),
  },

  'astroboy-view': {
    enable: true,
    path: path.resolve(__dirname, '../plugins/astroboy-view'),
  },
};

export = defaultPluginConfig;
