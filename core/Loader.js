'use strict';
const glob = require('fast-glob');
const path = require('path');
const APP_EXTENSIONS = ['js', 'ts'];

class Loader {
  constructor(options = {}) {
    this.dirs = options.dirs;
    this.config = options.config;
    this.app = options.app;
  }

  load() {}

  resolveExtensions(path, resolveDevide = false) {
    let newPath = path;
    APP_EXTENSIONS.forEach(ext => (newPath = newPath.replace(`.${ext}`, '')));
    return resolveDevide ? newPath.replace(/\//g, '.') : newPath;
  }

  globDirs(patterns, callback) {
    this.dirs.forEach(item => {
      this.globDir(item.baseDir, patterns, callback);
    });
  }

  globDir(baseDir, patterns, callback) {
    let newPatterns;
    if (typeof patterns === 'string') {
      newPatterns = [`${baseDir}${patterns}`];
    } else if (Array.isArray(patterns)) {
      newPatterns = patterns.map(pattern => {
        return `${baseDir}${pattern}`;
      });
    }
    const entries = glob.sync(newPatterns, { dot: true });

    callback(entries.filter(i => !i.includes('.d.ts')));
  }

  // 获取插件的根目录
  // 要求插件的入口文件必须放在插件根目录
  getPluginPath(plugin) {
    if (plugin.path) {
      return plugin.path;
    }
    const name = plugin.package || plugin.name;
    const entryFile = require.resolve(name);
    return path.dirname(entryFile);
  }
}

module.exports = Loader;
