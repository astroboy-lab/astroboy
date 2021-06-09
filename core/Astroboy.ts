import * as path from 'path';
import * as Koa from 'koa';
import { EventEmitter } from 'events';
import { IAstroboyOptions, IInnerApplication } from '../definitions/core';
import { IAstroboyFrameworkDefine } from '../definitions';
import { IBaseFrameworkDefine } from '../definitions/extends/context';
import { CoreLoader } from './CoreLoader';
import { BaseClass as AstroboyBaseClass } from './base/BaseClass';

const completeAssign = require('complete-assign');

import {
  request as mockRequest,
  response as mockResponse,
  context as mockContext,
  application as mockApplication,
} from '../core/lib/mockKoa';

import * as compose from 'koa-compose';
/**
 * ## Astroboy Framework
 *
 * @author Big Mogician
 * @class Astroboy
 * @extends {EventEmitter}
 * @template DEFINE Framework Definition, defalut is `IAstroboyFrameworkDefine`.
 */
class Astroboy<DEFINE extends Partial<IBaseFrameworkDefine> = IAstroboyFrameworkDefine> extends EventEmitter {
  protected app!: DEFINE['app'];
  protected options!: IAstroboyOptions;
  private loader!: CoreLoader<DEFINE['config'], any>;

  protected extends = {
    app: null,
    context: null,
    request: null,
    response: null,
  };

  protected get [Symbol.for('BASE_DIR')]() {
    return path.join(__dirname, '..');
  }

  constructor(options: Partial<IAstroboyOptions> = {}) {
    super();
    options.NODE_ENV =
      process.env.APPLICATION_STANDARD_ENV || process.env.NODE_ENV || options.NODE_ENV || 'development';
    options.NODE_PORT = process.env.NODE_PORT || options.NODE_PORT || '8201';
    options.ROOT_PATH = options.ROOT_PATH || process.cwd();
    this.options = <IAstroboyOptions>options;
  }

  public async run() {
    await this.init();
    this.start();
  }

  async initAe() {
    this.app = <any>new Koa();
    this.app.env = this.options.NODE_ENV;
    this.app.proxy = this.options.PROXY;
    this.app.MODE_AE = this.options.MODE_AE;
    (<IInnerApplication>(<unknown>this.app)).NODE_ENV = this.options.NODE_ENV;
    (<IInnerApplication>(<unknown>this.app)).ROOT_PATH = this.options.ROOT_PATH;
    (<IInnerApplication>(<unknown>this.app)).ROOT_NAME = path.basename(this.options.ROOT_PATH);
    this.loader = new CoreLoader<DEFINE['config'], any>({
      astroboy: this,
      app: this.app,
    });
    await this.loader.load();

    completeAssign(mockApplication, this.app);
  }

  handleCtx(ctx: any) {
    Object.setPrototypeOf(
      ctx.app,
      (this.extends.app = this.extends.app ?? Object.setPrototypeOf(mockApplication, Object.getPrototypeOf(ctx.app)))
    );

    Object.setPrototypeOf(
      ctx.request,
      (this.extends.request =
        this.extends.request ?? Object.setPrototypeOf(mockRequest, Object.getPrototypeOf(ctx.request)))
    );

    Object.setPrototypeOf(
      ctx.response,
      (this.extends.response =
        this.extends.response ?? Object.setPrototypeOf(mockResponse, Object.getPrototypeOf(ctx.response)))
    );

    Object.setPrototypeOf(
      ctx,
      (this.extends.context = this.extends.context ?? Object.setPrototypeOf(mockContext, Object.getPrototypeOf(ctx)))
    );
    return compose(this.loader.middlewareList)(ctx);
  }

  protected async init() {
    this.app = <any>new Koa();
    this.app.env = this.options.NODE_ENV;
    this.app.proxy = this.options.PROXY;
    (<IInnerApplication>(<unknown>this.app)).NODE_ENV = this.options.NODE_ENV;
    (<IInnerApplication>(<unknown>this.app)).ROOT_PATH = this.options.ROOT_PATH;
    (<IInnerApplication>(<unknown>this.app)).ROOT_NAME = path.basename(this.options.ROOT_PATH);

    this.loader = new CoreLoader<DEFINE['config'], any>({
      astroboy: this,
      app: this.app,
    });

    await this.loader.load()
  }

  private start() {
    this.app.listen(this.options.NODE_PORT, () => {
      console.log('应用启动成功');
      console.log(`访问地址：${'http://127.0.0.1:' + this.options.NODE_PORT}`);
      this.emit('start', this.app);
    });
    this.app.on('error', (err: any, ctx: DEFINE['ctx']) => {
      this.emit('error', err, ctx);
    });
    // 添加默认的 error 事件监听器
    setTimeout(() => {
      if (this.listenerCount('error') === 0) {
        this.on('error', (err, ctx) => {
          console.log('[default error callback]');
          console.log(err);
        });
      }
    }, 3000);
  }
}

namespace Astroboy {
  /** ### Astroboy Base Class */
  export const BaseClass = AstroboyBaseClass;
  export type BaseClass = AstroboyBaseClass;

  /** ### Astroboy Controller Base */
  export const Controller = AstroboyBaseClass;
  export type Controller = AstroboyBaseClass;

  /** ### Astroboy Service Base */
  export const Service = AstroboyBaseClass;
  export type Service = AstroboyBaseClass;

  /** ### Astroboy <Helper&Utils> Base */
  export const Helper = AstroboyBaseClass;
  export type Helper = AstroboyBaseClass;
}

export = Astroboy;
