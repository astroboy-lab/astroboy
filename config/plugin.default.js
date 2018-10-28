/**
 * 默认插件配置文件
 */
const path = require('path');

module.exports = {

  'astroboy-body': {
    enable: true,
    path: path.resolve(__dirname, '../plugins/astroboy-body')
  },

  'astroboy-router': {
    enable: true,
    path: path.resolve(__dirname, '../plugins/astroboy-router')
  },

  'astroboy-security': {
    enable: true,
    path: path.resolve(__dirname, '../plugins/astroboy-security')
  },

  'astroboy-static': {
    enable: true,
    path: path.resolve(__dirname, '../plugins/astroboy-static')
  },

  'astroboy-view': {
    enable: true,
    path: path.resolve(__dirname, '../plugins/astroboy-view')
  },

};