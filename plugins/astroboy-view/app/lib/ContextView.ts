import * as path from 'path';
import * as assert from 'assert';
import { IContextView } from '../../contract';

const RENDER = Symbol.for('contextView#render');
const RENDER_STRING = Symbol.for('contextView#renderString');
const GET_VIEW_ENGINE = Symbol.for('contextView#getViewEngine');

export class ContextView implements IContextView {
  private app: any;
  private viewManager: any;
  private config: any;

  constructor(private ctx: any) {
    this.app = this.ctx.app;
    this.viewManager = this.app.view;
    this.config = this.app.view.config;
  }

  public render(...args: any[]) {
    return (this[RENDER] as any)(...args);
  }

  private async [RENDER](name: string, state: any = {}, options: any = {}) {
    const filename = await this.viewManager.resolve(name);

    // get the name of view engine,
    // if viewEngine is specified in options, don't match extension
    let viewEngineName = options.viewEngine;
    if (!viewEngineName) {
      const ext = path.extname(filename);
      viewEngineName = this.viewManager.extMap.get(ext);
    }
    // use the default view engine that is configured if no matching above
    if (!viewEngineName) {
      viewEngineName = this.config.defaultViewEngine;
    }

    assert(viewEngineName, `Can't find viewEngine for ${filename}`);

    // get view engine and render
    const view = this[GET_VIEW_ENGINE](viewEngineName);

    return await view.render(filename, state, options);
  }

  private [GET_VIEW_ENGINE](name: string) {
    const ViewEngine = this.viewManager.get(name);
    assert(ViewEngine, `Can't find ViewEngine "${name}"`);

    // use view engine to render
    const engine = new ViewEngine(this.ctx);
    // wrap render and renderString to support both async function and generator function
    // if (engine.render) engine.render = this.app.toAsyncFunction(engine.render);
    // if (engine.renderString) engine.renderString = this.app.toAsyncFunction(engine.renderString);
    return engine;
  }
}
