// @ts-ignore no types matched
import * as pathMatching from 'path-matching';
import * as path from 'path';
import merge from 'lodash.merge';
import isPlainObject from 'lodash.isplainobject';
import { outputJsonAsync } from './lib/util';
import {
  IInnerApplication,
  PureObject,
  IDir,
  PriorityDefine as IPriority,
  IDefaultLoaders,
  NormalizedMiddleware,
  ICoreLoaderOptions,
} from '../definitions/core';
import { Loader } from './Loader';
import { Middleware } from 'koa'

/**
 * ## Core Loader
 * - decide how to build application.
 *
 * @author Big Mogician
 * @export
 * @class CoreLoader
 * @extends {Loader<F, A>}
 * @template F
 * @template A
 */
export class CoreLoader<F extends PureObject, A extends IInnerApplication<F>> extends Loader<F, A> {
  protected options!: Partial<ICoreLoaderOptions<F, A>>;
  protected patterns!: IDefaultLoaders;
  protected pluginConfig!: PureObject;
  protected astroboy!: any;
  protected loaders!: PureObject;
  protected coreDirs!: IDir[];
  protected loaderQueue!: IPriority[];
  protected NODE_ENV!: string;
  middlewareList: Middleware[] = [];

  get defaultPatterns(): IDefaultLoaders {
    return {
      loaderPattern: `/loader/*.(js|ts)`,
      pluginPattern: `/config/plugin.(default|${this.NODE_ENV}).(js|ts)`,
      loaderConfigPattern: `/config/loader.(default|${this.NODE_ENV}).(js|ts)`,
    };
  }

  constructor(options: Partial<ICoreLoaderOptions<F, A>> = {}) {
    super(options);
    this.options = options || {};
    this.astroboy = this.options.astroboy;
    this.app = this.options.app || this.app;
    this.NODE_ENV = this.app.NODE_ENV || 'development';
    this.patterns = Object.assign({}, this.defaultPatterns);
  }

  /**
   * ### `init` hook
   *
   * @virtual
   * @author Big Mogician
   * @protected
   * @memberof CoreLoader
   */
  protected async init() {
    await this.loadCoreDirs(this.app.ROOT_PATH);
    await this.loadPluginConfig();
    await this.loadFullDirs();
    await this.loadLoaderQueue();
    await this.loadLoaders();
    await this.runLoaders();
    this.useMiddlewares();
  }

  /**
   * ### `load` hook
   *
   * @virtual
   * @author Big Mogician
   * @memberof CoreLoader
   */
  public async load() {
    await this.init();
  }

  /**
   * ### 加载核心目录，包括 app、framework，但不包括 plugin
   *
   * @author Big Mogician
   * @protected
   * @param {string} baseDir
   * @memberof CoreLoader
   */
  protected async loadCoreDirs(baseDir: string) {
    const coreDirs: IDir[] = [
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
    await outputJsonAsync(`${this.app.ROOT_PATH}/run/coreDirs.json`, this.coreDirs);
  }

  /**
   * ### 获取插件配置
   *
   * @author Big Mogician
   * @protected
   * @memberof CoreLoader
   */
  protected async loadPluginConfig() {
    let pluginConfig: PureObject = {};

    for (const item of this.coreDirs) {
      const entries = await this.globDir(item.baseDir, this.patterns.pluginPattern);
      pluginConfig = entries.reduce((a, b) => {
        const content = require(b as string);
        return merge(a, content);
      }, pluginConfig);
    }

    this.pluginConfig = pluginConfig;
    await outputJsonAsync(`${this.app.ROOT_PATH}/run/pluginConfig.json`, pluginConfig);
  }

  /**
   * ### 获取遍历目录
   *
   * @author Big Mogician
   * @protected
   * @memberof CoreLoader
   */
  protected async loadFullDirs() {
    let dirs: IDir[] = [];

    for (const item of this.coreDirs) {
      dirs = dirs.concat((await this.getPluginDirs(item.baseDir)).reverse());
      dirs.push(item);
    }

    this.dirs = dirs;
    await outputJsonAsync(`${this.app.ROOT_PATH}/run/dirs.json`, dirs);
  }

  /**
   * ### 获取需要遍历的插件目录
   *
   * @author Big Mogician
   * @protected
   * @param {string} baseDir
   * @returns
   * @memberof CoreLoader
   */
  protected async getPluginDirs(baseDir: string) {
    const config = await this.getPluginConfig(baseDir);
    const ret: IDir[] = [];
    if (isPlainObject(config)) {
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

  /**
   * ### 获取需要遍历的插件配置
   *
   * @author Big Mogician
   * @protected
   * @param {string} baseDir
   * @returns
   * @memberof CoreLoader
   */
  protected async getPluginConfig(baseDir: string) {
    let config: PureObject = {};
    const entries = await this.globDir(baseDir, this.patterns.pluginPattern);
    config = entries.reduce((a, b) => {
      return merge(a, require(b as string));
    }, {});
    return config;
  }

  /**
   * ### 获取加载器执行队列
   *
   * @author Big Mogician
   * @protected
   * @memberof CoreLoader
   */
  protected async loadLoaderQueue() {
    let loaderConfig: PureObject = {};
    const entries = await this.globDirs(this.patterns.loaderConfigPattern);
    loaderConfig = entries.reduce((previousValue, currentValue) => {
      return merge(previousValue, require(currentValue as string));
    }, loaderConfig);
    let queue: IPriority[] = [];
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

  /**
   * ### 获取加载器
   *
   * @author Big Mogician
   * @protected
   * @memberof CoreLoader
   */
  protected async loadLoaders() {
    let loaders: PureObject = {};
    const entries = await this.globDirs(this.patterns.loaderPattern);
    entries.forEach(entry => {
      const key = this.resolveExtensions(path.basename(entry as string));
      loaders[key] = require(entry as string);
    });
    this.loaders = loaders;
  }

  /**
   * ### 执行加载器
   *
   * @author Big Mogician
   * @protected
   * @memberof CoreLoader
   */
  protected async runLoaders() {
    const app = this.app;
    const loaders = this.loaders;
    for (const item of this.loaderQueue) {
      if (loaders[item.name]) {
        const loader = new loaders[item.name]({
          dirs: this.dirs,
          config: item.options,
          app,
        });
        if (!(loader instanceof Loader)) {
          throw new Error(`Loader ${item.name} must extend Loader.`);
        }
        await loader.load();
      } else {
        throw new Error(`Loader ${item.name} is not found.`);
      }
    }
  }

  /**
   * ### Use Middlewares
   *
   * @author Big Mogician
   * @protected
   * @memberof CoreLoader
   */
  protected useMiddlewares() {
    const app = this.app;
    const middlewares = app.middlewares;
    const self = this
    app.middlewareQueue.forEach(item => {
      if (middlewares[item.name]) {
        let fn = middlewares[item.name](item.options, app);
        // 定义扩宽，match和ignore实际上只有一个存在并生效
        if ((<any>item).match || (<any>item).ignore) {
          fn = this.wrapMiddleware(fn, item);
        }
        if (fn) {
          app.use(fn);
          self.middlewareList.push(fn)
        }
      } else {
        throw new Error(`middleware ${item.name} is not found.`);
      }
    });
  }

  /**
   * ### Wrap Middlewares
   *
   * @author Big Mogician
   * @protected
   * @param {NormalizedMiddleware} middleware
   * @param {IPriority} options
   * @returns
   * @memberof CoreLoader
   */
  protected wrapMiddleware(middleware: NormalizedMiddleware, options: IPriority) {
    const match: (ctx: any) => boolean = pathMatching(options);
    let fn: any = async function(ctx: any, next: () => Promise<any>) {
      if (match(ctx)) {
        await middleware(ctx, next);
      } else {
        await next();
      }
    };
    fn._name = `wrap-${middleware.name || (<any>middleware)._name}`;
    return fn as NormalizedMiddleware;
  }
}
