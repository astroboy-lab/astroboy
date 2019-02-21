'use strict';
const glob = require('fast-glob');
const APP_EXTENSIONS = ['js', 'ts'];

class Loader {
  constructor(options = {}) {
    this.dirs = options.dirs;
    this.config = options.config;
    this.app = options.app;
  }

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
}

module.exports = Loader;
