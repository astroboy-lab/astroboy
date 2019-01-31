const fs = require('fs-extra');
const path = require('path');
const lodash = require('lodash');
const glob = require('fast-glob');
const requestProto = require('koa/lib/request');
const responseProto = require('koa/lib/response');
const contextProto = require('koa/lib/context');
const applicationProto = require('koa/lib/application').prototype;

// 用于像既有原型注入方法, 实现对 class 的隐式扩充(非继承式)
const completeAssign = require('complete-assign');
const assert = require('assert');
const Util = require('../lib/util');

class CoreLoader {

  get defaultPatterns() {
    return {
      application: `/app/extends/application.${this.SUPPORT_EXT}`,
      context: [`/app/extends/context/*.${this.SUPPORT_EXT}`, `/app/extends/context.${this.SUPPORT_EXT}`],
      request: `/app/extends/request.${this.SUPPORT_EXT}`,
      response: `/app/extends/response.${this.SUPPORT_EXT}`,
      controller: `/app/controllers/**/*.${this.SUPPORT_EXT}`,
      service: `/app/services/**/*.${this.SUPPORT_EXT}`,
      router: `/app/routers/**/*.${this.SUPPORT_EXT}`,
      middleware: `/app/middlewares/*.${this.SUPPORT_EXT}`,
      lib: `/app/lib/*.${this.SUPPORT_EXT}`,
      config: [
        '/config/config.default.js',
        `/config/config.${this.NODE_ENV}.js`
      ],
      middlewareConfig: [
        '/config/middleware.default.js',
        `/config/middleware.${this.NODE_ENV}.js`
      ],
      pluginConfig: [
        '/config/plugin.default.js',
        `/config/plugin.${this.NODE_ENV}.js`
      ]
    };
  }

  constructor(options = {}) {
    this.options = options;
    this.baseDir = this.options.baseDir;
    this.astroboy = this.options.astroboy;
    this.app = this.options.app;
    this.NODE_ENV = this.app.NODE_ENV;
    this.APP_EXTENSIONS = this.app.APP_EXTENSIONS;
    this.SUPPORT_EXT = this.APP_EXTENSIONS.length === 1 ? this.APP_EXTENSIONS[0] : `(${this.APP_EXTENSIONS.join('|')})`;

    // NOTE: 实例化 loader 的参数里没有 patterns 字段?
    this.patterns = Object.assign({}, this.defaultPatterns, options.patterns);

    this.init();
  }

  init() {
    this.loadDirs(this.baseDir);
    this.loadAstroboyPkg();
    this.loadExtend(this.patterns.application, applicationProto);
    this.loadExtend(this.patterns.context, contextProto);
    this.loadExtend(this.patterns.request, requestProto);
    this.loadExtend(this.patterns.response, responseProto);
    this.loadConfig();
    this.loadMiddlewareConfig();
    this.loadMiddlewares();
    this.loadMiddlewareQueue();
    this.loadLib();
    this.loadBoot();
  }

  // load astroboy package.json
  loadAstroboyPkg() {
    const pkgPath = path.resolve(__dirname, '../../package.json');
    if (fs.existsSync(pkgPath)) {
      this.app.pkg = require(pkgPath);
    }
  }

  // 获取遍历目录
  loadDirs(baseDir) {
    let dirs = [{
      baseDir: baseDir,
      type: 'app',
      name: path.basename(baseDir)
    }];
    dirs = dirs.concat(this.getPluginDirs(baseDir));

    let proto = this.astroboy;
    while (proto) {
      proto = Object.getPrototypeOf(proto);
      if (proto) {
        const newBaseDir = proto[Symbol.for('BASE_DIR')];
        if (newBaseDir) {
          dirs.push({
            baseDir: newBaseDir,
            type: 'framework',
            name: path.basename(newBaseDir)
          });
          dirs = dirs.concat(this.getPluginDirs(newBaseDir));
        }
      }
    }
    dirs = dirs.reverse();

    this.dirs = dirs;
    Util.outputJsonSync(`${this.baseDir}/run/dirs.json`, dirs);
  }

  // 获取需要遍历的插件目录
  getPluginDirs(baseDir) {
    const config = this.getPluginConfig(baseDir);

    let ret = [];
    if (lodash.isPlainObject(config)) {
      for (let name in config) {
        if (config[name].enable) {
          const baseDir = this.getPluginPath(config[name]);
          ret.push({
            baseDir: baseDir,
            type: 'plugin',
            name: path.basename(baseDir)
          });
        }
      }
    }
    return ret;
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

  getPluginConfig(baseDir) {
    let config = {};
    this.globItem(baseDir, this.patterns.pluginConfig, (entries) => {
      config = entries.reduce((a, b) => {
        return lodash.merge(a, require(b));
      }, {});
    });
    return config;
  }

  globItem(baseDir, patterns, callback) {
    let newPatterns;
    if (typeof patterns === 'string') {
      newPatterns = [`${baseDir}${patterns}`];
    } else if (Array.isArray(patterns)) {
      newPatterns = patterns.map(pattern => {
        return `${baseDir}${pattern}`;
      });
    }
    const arr = glob.sync(newPatterns, { dot: true });
    callback(arr.filter(i => !i.includes('.d.ts')));
  }

  globDirs(patterns, callback) {
    this.dirs.forEach(item => {
      this.globItem(item.baseDir, patterns, callback);
    });
  }

  loadExtend(patterns, proto) {
    this.globDirs(patterns, (entries) => {
      entries.forEach(entry => {
        completeAssign(proto, require(entry));
      });
    });
  }

  // load config file
  // config.default.js / config.${env}.js
  loadConfig() {
    let config = {};
    this.globDirs(this.patterns.config, (entries) => {
      config = entries.reduce((a, b) => {
        let content = require(b);
        if (lodash.isFunction(content)) {
          return lodash.merge(a, content(this.app));
        } else if (lodash.isPlainObject(content)) {
          return lodash.merge(a, content);
        }
      }, config);
    });
    this.app.config = config;
    Util.outputJsonSync(`${this.baseDir}/run/config.json`, config);
  }

  loadMiddlewareConfig() {
    let config = {};
    this.globDirs(this.patterns.middlewareConfig, (entries) => {
      entries.forEach(entry => {
        config = lodash.merge(config, require(entry));
      });
    });
    this.app.middlewareConfig = config;
  }

  loadMiddlewares() {
    let middlewares = {};
    this.globDirs(this.patterns.middleware, (entries) => {
      entries.forEach(entry => {
        const key = this.resolveExtensions(path.basename(entry));
        middlewares[key] = require(entry);
      });
    });
    this.app.middlewares = middlewares;
    // Util.outputJsonSync(`${this.baseDir}/run/middlewares-available.json`, Object.keys(middlewares));
  }

  loadMiddlewareQueue() {
    const config = this.app.middlewareConfig;
    let middlewareQueue = [];
    Object.keys(config).forEach(item => {
      middlewareQueue.push(Object.assign({
        priority: 300,
        name: item
      }, config[item]));
    });
    middlewareQueue = middlewareQueue
      .filter(item => {
        return item.enable === true
      })
      .sort((a, b) => {
        return a.priority - b.priority;
      });
    this.app.middlewareQueue = middlewareQueue;
    Util.outputJsonSync(`${this.baseDir}/run/middlewares.json`, middlewareQueue);
  }

  loadLib() {
    let libs = {};
    this.dirs.forEach(item => {
      const indexFile = `${item.baseDir}/app/lib/index.js`;
      if (fs.existsSync(indexFile)) {
        libs[item.name] = require(indexFile);
      } else {
        this.globItem(item.baseDir, this.patterns.lib, (entries) => {
          if (entries.length > 0) {
            libs[item.name] = {};
            entries.forEach(entry => {
              const key = this.resolveExtensions(entry.split('lib/')[1], true);
              libs[item.name][key] = require(entry);
            });
          }
        });
      }
    });

    this.app.libs = libs;

    let logs = {};
    for (let packageName in libs) {
      logs[packageName] = Object.keys(libs[packageName]);
    }
    Util.outputJsonSync(`${this.baseDir}/run/libs.json`, logs);
  }

  loadBoot() {
    this.dirs.forEach(dir => {
      if (fs.existsSync(`${dir.baseDir}/boot.js`)) {
        let boot = require(`${dir.baseDir}/boot.js`);
        assert(lodash.isFunction(boot), `${dir.baseDir}/boot.js must return a function.`)
        boot(this.app);
      }
    });
  }

  resolveExtensions(path, resolveDevide = false) {
    let newPath = path;
    this.APP_EXTENSIONS.forEach(ext => newPath = newPath.replace(`.${ext}`, ''));
    return resolveDevide ? newPath.replace(/\//g, '.') : newPath;
  }

}

module.exports = CoreLoader;