const assert = require('assert');
const path = require('path');
const fs = require('fs-extra');

class ViewManager extends Map {

  /**
   * @param {Application} app - application instance
   */
  constructor(app) {
    super();
    this.config = app.config.view;
    if (typeof this.config.root === 'string') {
      this.config.root = [this.config.root];
    }

    this.extMap = new Map();
    this.fileMap = new Map();
    for (const ext of Object.keys(this.config.mapping)) {
      this.extMap.set(ext, this.config.mapping[ext]);
    }
  }

  /**
   * This method can register view engine.
   *
   * You can define a view engine class contains two method, `render` and `renderString`
   *
   * ```js
   * class View {
   *   render() {}
   *   renderString() {}
   * }
   * ```
   * @param {String} name - the name of view engine
   * @param {Object} viewEngine - the class of view engine
   */
  use(name, viewEngine) {
    assert(name, 'name is required');
    assert(!this.has(name), `${name} has been registered`);

    assert(viewEngine, 'viewEngine is required');
    assert(viewEngine.prototype.render, 'viewEngine should implement `render` method');
    assert(viewEngine.prototype.renderString, 'viewEngine should implement `renderString` method');

    this.set(name, viewEngine);
  }

  async resolve(name) {
    const config = this.config;

    // check cache
    let filename = this.fileMap.get(name);
    if (config.cache && filename) {
      return filename;
    }

    // try find it with default extension
    filename = this.resolvePath([name, name + config.defaultExtension], config.root);

    // set cache
    this.fileMap.set(name, filename);
    return filename;
  }

  resolvePath(names, root) {
    for (const name of names) {
      for (const dir of root) {
        const filename = path.resolve(dir, name);
        if (fs.existsSync(filename)) {
          return filename;
        }
      }
    }
  }

}

module.exports = ViewManager;