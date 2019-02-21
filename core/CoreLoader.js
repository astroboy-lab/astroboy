const path = require('path');
const lodash = require('lodash');
const pathMatching = require('path-matching');
const Util = require('./lib/util');
const Loader = require('./Loader');

class CoreLoader extends Loader {
  get defaultPatterns() {
    return {
      loaderPattern: `/loader/*.(js|ts)`,
      pluginPattern: `/config/plugin.(default|${this.NODE_ENV}).js`,
      loaderConfigPattern: `/config/loader.(default|${this.NODE_ENV}).js`,
    };
  }

  constructor(options = {}) {
    super(options);
    this.options = options;
    this.baseDir = this.options.baseDir;
    this.astroboy = this.options.astroboy;
    this.app = this.options.app;
    this.NODE_ENV = this.app.NODE_ENV;

    // NOTE: 实例化 loader 的参数里没有 patterns 字段?
    this.patterns = Object.assign({}, this.defaultPatterns, options.patterns);

    this.init();
  }

  init() {
    this.loadCoreDirs(this.baseDir);
    this.loadPluginConfig();
    this.loadFullDirs();

    this.loadLoaderQueue();
    this.loadLoaders();
    this.runLoaders();

    this.useMiddlewares();
  }

  // 加载核心目录，包括 app、framework，但不包括 plugin
  loadCoreDirs(baseDir) {
    let coreDirs = [
      {
        baseDir: baseDir,
        type: 'app',
        name: path.basename(baseDir),
      },
    ];
    let proto = this.astroboy;
    while (proto) {
      proto = Object.getPrototypeOf(proto);
      if (proto) {
        const newBaseDir = proto[Symbol.for('BASE_DIR')];
        if (newBaseDir) {
          coreDirs.push({
            baseDir: newBaseDir,
            type: 'framework',
            name: path.basename(newBaseDir),
          });
        }
      }
    }
    this.coreDirs = coreDirs.reverse();
    Util.outputJsonSync(`${this.baseDir}/run/coreDirs.json`, this.coreDirs);
  }

  // 获取插件配置
  loadPluginConfig() {
    let pluginConfig = {};
    this.coreDirs.forEach(item => {
      this.globDir(item.baseDir, this.patterns.pluginPattern, entries => {
        pluginConfig = entries.reduce((a, b) => {
          let content = require(b);
          return lodash.merge(a, content);
        }, pluginConfig);
      });
    });
    this.pluginConfig = pluginConfig;
    Util.outputJsonSync(`${this.baseDir}/run/pluginConfig.json`, pluginConfig);
  }

  // 获取遍历目录
  loadFullDirs() {
    let dirs = [];
    this.coreDirs.forEach(item => {
      dirs = dirs.concat(this.getPluginDirs(item.baseDir).reverse());
      dirs.push(item);
    });

    this.dirs = dirs;
    Util.outputJsonSync(`${this.baseDir}/run/dirs.json`, dirs);
  }

  // 获取需要遍历的插件目录
  getPluginDirs(baseDir) {
    const config = this.getPluginConfig(baseDir);

    let ret = [];
    if (lodash.isPlainObject(config)) {
      for (let name in config) {
        if (this.pluginConfig[name].enable) {
          const baseDir = this.getPluginPath(config[name]);
          ret.push({
            baseDir: baseDir,
            type: 'plugin',
            name: path.basename(baseDir),
          });
        }
      }
    }
    return ret;
  }

  getPluginConfig(baseDir) {
    let config = {};
    this.globDir(baseDir, this.patterns.pluginPattern, entries => {
      config = entries.reduce((a, b) => {
        return lodash.merge(a, require(b));
      }, {});
    });
    return config;
  }

  // 获取加载器执行队列
  loadLoaderQueue() {
    let loaderConfig = {};
    this.globDirs(this.patterns.loaderConfigPattern, entries => {
      loaderConfig = entries.reduce((previousValue, currentValue) => {
        return lodash.merge(previousValue, require(currentValue));
      }, loaderConfig);
    });

    let queue = [];
    Object.keys(loaderConfig).forEach(item => {
      queue.push(
        Object.assign(
          {
            priority: 300,
            name: item,
          },
          loaderConfig[item]
        )
      );
    });
    queue = queue.sort((a, b) => {
      return a.priority - b.priority;
    });
    this.loaderQueue = queue;
  }

  // 获取加载器
  loadLoaders() {
    let loaders = {};
    this.globDirs(this.patterns.loaderPattern, entries => {
      entries.forEach(entry => {
        const key = this.resolveExtensions(path.basename(entry));
        loaders[key] = require(entry);
      });
    });
    this.loaders = loaders;
  }

  // 执行加载器
  runLoaders() {
    const app = this.app;
    const loaders = this.loaders;

    this.loaderQueue.forEach(item => {
      if (loaders[item.name]) {
        const loader = new loaders[item.name]({
          dirs: this.dirs,
          config: item.options,
          app,
        });
        if (!(loader instanceof Loader)) {
          throw new Error(`Loader ${item.name} must extend Loader.`);
        }
        loader.load();
      } else {
        throw new Error(`Loader ${item.name} is not found.`);
      }
    });
  }

  useMiddlewares() {
    const app = this.app;
    const middlewares = app.middlewares;
    app.middlewareQueue.forEach(item => {
      if (middlewares[item.name]) {
        let fn = middlewares[item.name](item.options, app);
        fn = this.wrapMiddleware(fn, item);
        if (fn) {
          app.use(fn);
        }
      } else {
        throw new Error(`middleware ${item.name} is not found.`);
      }
    });
  }

  wrapMiddleware(middleware, options) {
    const match = pathMatching(options);
    let fn = async function(ctx, next) {
      if (match(ctx)) {
        await middleware(ctx, next);
      } else {
        await next();
      }
    };
    fn._name = `wrap-${middleware.name || middleware._name}`;
    return fn;
  }
}

module.exports = CoreLoader;
