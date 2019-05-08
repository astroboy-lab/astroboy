import { PureObject } from '../../core';

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
