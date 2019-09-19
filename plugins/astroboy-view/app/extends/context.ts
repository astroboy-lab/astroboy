import { ContextView } from '../lib/ContextView';
import { IAstroboyViewPluginCtxExtends, IContextView } from '../../contract';

const VIEW = Symbol('Context#view');

const ctx: IAstroboyViewPluginCtxExtends = {
  get view() {
    if (!(<any>this)[VIEW]) {
      (<any>this)[VIEW] = new ContextView(this);
    }
    return (<any>this)[VIEW];
  },

  render(this: any, ...args) {
    return this.renderView(...args).then((body: any) => {
      this.body = body;
    });
  },

  renderView(...args) {
    return this.view.render(...args);
  },

  renderString(...args) {
    return this.view.render(...args);
  },
};

export = ctx;
