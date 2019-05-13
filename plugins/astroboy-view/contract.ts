import { PureObject } from '../../definitions/core';

export interface IAstroboyViewPluginAppExtends<T = any> {
  readonly view: T;
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

export interface IContextView {
  render(...args: any[]): any;
  renderString(...args: any[]): any;
}

export interface IAstroboyViewPluginCtxExtends<T = IContextView> extends IAstroboyViewPluginAppExtends<T> {
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

  /**
   * Render template string, same as {@link @ContextView#renderString}
   * @return {Promise} result
   */
  renderString(...args: any[]): Promise<any>;
}
