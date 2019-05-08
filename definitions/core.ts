import Koa from 'koa';

export interface IBaseApplication<F extends PureObject = PureObject> extends Koa {
  config: F;
}

export interface IBaseContext<F extends PureObject = PureObject, A extends IBaseApplication = IBaseApplication<F>>
  extends Koa.Context {
  app: A;
  config: F;
}

export interface IInnerApplication<F extends PureObject = PureObject> extends IBaseApplication<F> {
  ROOT_PATH: string;
  ROOT_NAME: string;
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
