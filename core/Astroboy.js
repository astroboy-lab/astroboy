const path = require('path');
const chalk = require('chalk');
const Application = require('./Application');
const DefaultLoader = require('./DefaultLoader');

class Astroboy {

  get[Symbol.for('BASE_DIR')]() {
    return path.join(__dirname, '..');
  }

  constructor(options = {}) {
    options.NODE_ENV = process.env.NODE_ENV || options.NODE_ENV || 'development';
    options.NODE_PORT = process.env.NODE_PORT || options.NODE_PORT || 8201;
    options.ROOT_PATH = options.ROOT_PATH || process.cwd();
    this.options = options;

    this.init();
    this.start();
    return this;
  }

  init() {
    this.app = new Application();
    this.app.env = this.options.NODE_ENV;
    this.app.NODE_ENV = this.options.NODE_ENV;
    this.app.ROOT_PATH = this.options.ROOT_PATH;

    this.loader = new DefaultLoader({
      baseDir: this.options.ROOT_PATH,
      astroboy: this,
      app: this.app
    });
  }

  start() {
    this.app.listen(this.options.NODE_PORT, () => {
      console.log('');
      console.log(chalk.green('应用启动成功'));
      console.log(chalk.green(`访问地址：${chalk.blue('http://127.0.0.1:' + this.options.NODE_PORT)}`));
    });
    let defaultErrorCallback = err => {
      console.log('defaultErrorCallback: ', err);
    };
    this.app.on('error', defaultErrorCallback);
  }

}

module.exports = Astroboy;