import { ViewManager } from '../lib/ViewManager';
import { IAstroboyViewPluginAppExtends } from '../../contract';

const VIEW = Symbol('Application#view');

const app: IAstroboyViewPluginAppExtends = {
  get view() {
    if (!(<any>this)[VIEW]) {
      (<any>this)[VIEW] = new ViewManager(this);
    }
    return (<any>this)[VIEW];
  },
};

export = app;
