import { IAstroboyViewPluginAppExtends } from './app';

export interface IAstroboyViewPluginCtxExtends extends IAstroboyViewPluginAppExtends {
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
