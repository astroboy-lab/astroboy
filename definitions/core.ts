import Koa from 'koa';

export interface IConstructor<T> {
  new (...args: any[]): T;
}

export interface IBaseApplication extends Koa {}

export interface IBaseContext extends Koa.Context {
  app: IBaseApplication;
  config: PureObject;
}

export interface IInnerApplication extends IBaseApplication {
  ROOT_PATH: string;
  NODE_ENV: string;
  middlewares: PureObject<(options: any, app: any) => (ctx: any, next: () => Promise<any>) => Promise<any>>;
  middlewareQueue: PriorityDefine[];
}

export type NormalizedMiddleware<T = any> = (ctx: T, next: () => Promise<any>) => Promise<any>;

export interface IDir {
  baseDir: string;
  type: 'app' | 'framework' | 'plugin';
  name: string;
}

export interface IAstroboyOptions {
  NODE_ENV: string;
  NODE_PORT: string;
  ROOT_PATH: string;
}

export interface ILoaderOptions<A extends IInnerApplication, F extends PureObject> {
  dirs: IDir[];
  config: F;
  app: A;
}

export interface IPluginEntry {
  path?: string;
  package?: string;
  name?: string;
}

export type PriorityDefine = PathIgnoreOptions & {
  priority: number;
  name: string;
};

export type ValidOperator<T = any> = string | RegExp | ((context: T) => boolean);
export type ValidOperators = ValidOperator[];

export interface IDefaultLoaders {
  loaderPattern: string;
  pluginPattern: string;
  loaderConfigPattern: string;
}

export interface IPathMatchOptions extends ITrueOptions {
  match: ValidOperator | ValidOperators;
}

export interface IPathIgnoreOptions extends ITrueOptions {
  ignore: ValidOperator | ValidOperators;
}

export interface ITrueOptions {
  options?: any;
}

export type PathIgnoreOptions = IPathMatchOptions | IPathIgnoreOptions;

export type PureObject<T = any> = { [prop: string]: T };
