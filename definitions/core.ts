import Koa from 'koa';
import { IConstructor } from './base';

/**
 * ## Base Framework Application
 *
 * @author Big Mogician
 * @export
 * @interface IBaseApplication
 * @extends {Koa}
 * @template F
 */
export interface IBaseApplication<F extends PureObject = PureObject> extends Koa {
  config: F;
}

/**
 * ## Base Framework Context
 *
 * @author Big Mogician
 * @export
 * @interface IBaseContext
 * @extends {Koa.Context}
 * @template F
 * @template A
 */
export interface IBaseContext<F extends PureObject = PureObject, A extends IBaseApplication = IBaseApplication<F>>
  extends Koa.Context {
  app: A;
  config: F;
  request: Koa.Request & {
    body: any;
  };
}

/**
 * ## Inner Framework Application
 *
 * @author Big Mogician
 * @export
 * @interface IInnerApplication
 * @extends {IBaseApplication<F>}
 * @template F
 */
export interface IInnerApplication<F extends PureObject = PureObject> extends IBaseApplication<F> {
  ROOT_PATH: string;
  ROOT_NAME: string;
  NODE_ENV: string;
  libs: PureObject<any>;
  controllers: PureObject<PureObject<IConstructor<any>>>;
  services: PureObject<PureObject<IConstructor<any>>>;
  middlewares: PureObject<MiddlewareFactory>;
  middlewareQueue: PriorityDefine[];
  middlewareConfig: PureObject<any>;
  routers: any[];
  versionMap: PureObject<any>;
  pkg: PureObject<any>;
  fns: PureObject<Function>;
  fnConfig: PureObject<any>;
}

export type MiddlewareFactory<OPTS extends any = any, APP extends IBaseApplication = IBaseApplication> = (
  options: OPTS,
  app: APP
) => (ctx: any, next: () => Promise<any>) => Promise<any>;

export type NormalizedMiddleware<T extends IBaseContext = IBaseContext> = (
  ctx: T,
  next: () => Promise<any>
) => Promise<any>;

export interface IDir {
  baseDir: string;
  type: 'app' | 'framework' | 'plugin';
  name: string;
}

export interface IAstroboyOptions {
  NODE_ENV: string;
  NODE_PORT: string;
  ROOT_PATH: string;
  PROXY: boolean;
}

export interface ILoaderOptions<F extends PureObject, A extends IBaseApplication> {
  dirs: IDir[];
  config: F;
  app: A;
}

export interface ICoreLoaderOptions<F extends PureObject, A extends IInnerApplication<F>> extends ILoaderOptions<F, A> {
  astroboy?: any;
}

export interface IPluginEntry {
  path?: string;
  package?: string;
  name?: string;
}

export type PriorityDefine = PathIgnoreOptions & {
  priority: number;
  name: string;
  enable?: boolean;
};

export type ValidOperator<T = any> = string | RegExp | ((context: T) => boolean);
export type ValidOperators = ValidOperator[];

export interface IDefaultLoaders {
  loaderPattern: string;
  pluginPattern: string;
  loaderConfigPattern: string;
}

export interface IPathMatchOptions<OPT = any> extends ITrueOptions<OPT> {
  match: ValidOperator | ValidOperators;
}

export interface IPathIgnoreOptions<OPT = any> extends ITrueOptions<OPT> {
  ignore: ValidOperator | ValidOperators;
}

export interface ITrueOptions<OPT = any> {
  options: OPT;
}

export type PathIgnoreOptions<OPT = any> = Partial<
  IPathMatchOptions<OPT> | IPathIgnoreOptions<OPT> | ITrueOptions<OPT>
>;

export type PureObject<T = any> = { [prop: string]: T };
