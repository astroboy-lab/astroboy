const path = require('path');
const lodash = require('lodash');
const Util = require('../lib/util');
const Loader = require('../Loader');

class CoreLoader extends Loader {
  get defaultPatterns() {
    return {
      loaderPattern: `/loader/*.${this.SUPPORT_EXT}`,
      pluginConfig: ['/config/plugin.default.js', `/config/plugin.${this.NODE_ENV}.js`],
      loaderConfigPatterns: ['/config/loader.default.js', `/config/loader.${this.NODE_ENV}.js`],
    };
  }

  constructor(options = {}) {
    super(options);
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
    this.loadCoreDirs(this.baseDir);
    this.loadPluginConfig();
    this.loadFullDirs();
    this.loadLoaderQueue();
    this.loadLoaders();
    this.runLoaders();
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
      this.globDir(item.baseDir, this.patterns.pluginConfig, entries => {
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

  // 获取加载器执行队列
  loadLoaderQueue() {
    let loaderConfig = {};
    this.dirs.forEach(item => {
      this.globDir(item.baseDir, this.patterns.loaderConfigPatterns, entries => {
        loaderConfig = entries.reduce((previousValue, currentValue) => {
          return lodash.merge(previousValue, require(currentValue));
        }, loaderConfig);
      });
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
    this.dirs.forEach(item => {
      this.globDir(item.baseDir, this.patterns.loaderPattern, entries => {
        entries.forEach(entry => {
          const key = this.resolveExtensions(path.basename(entry));
          loaders[key] = require(entry);
        });
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
        new loaders[item.name]({
          dirs: this.dirs,
          config: item.options,
          app,
        }).load();
      } else {
        throw new Error(`Loader ${item.name} is not found.`);
      }
    });
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
    this.globDir(baseDir, this.patterns.pluginConfig, entries => {
      config = entries.reduce((a, b) => {
        return lodash.merge(a, require(b));
      }, {});
    });
    return config;
  }
}

module.exports = CoreLoader;
