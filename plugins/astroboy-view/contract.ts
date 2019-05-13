import { PureObject } from '../../definitions/core';

export interface IContextView {
  render(...args: any[]): any;
  // 方法已经去掉了
  // renderString(...args: any[]): any;
}

export interface IViewManager {
  use(name: string, viewEngine: any): void;
  resolve(name: string): Promise<string>;
}

export interface IAstroboyViewPluginAppExtends {
  readonly view: IViewManager;
}

export interface IViewConfig {
  root: string;
  cache: boolean;
  defaultExtension: string;
  defaultViewEngine: string;
  mapping: PureObject;
}

export interface IAstroboyViewPluginConfigExtends {
  view: Partial<IViewConfig>;
}

export interface IAstroboyViewPluginCtxExtends {
  readonly view: IContextView;
  /**
   * Render a file, then set to body, the parameter is same as {@link @ContextView#render}
   * @return {Promise} result
   */
  render(...args: any[]): Promise<any>;

  /**
   * Render a file, same as {@link @ContextView#render}
   * @return {Promise} result
   */
  renderView(...args: any[]): Promise<any>;

  // renderString(...args: any[]): Promise<any>;
}
