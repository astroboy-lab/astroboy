const EventEmitter = require('events');
const path = require('path');
const chalk = require('chalk');
const Application = require('./Application');
const DefaultLoader = require('./DefaultLoader');

class Astroboy extends EventEmitter {

  get [Symbol.for('BASE_DIR')]() {
    return path.join(__dirname, '..');
  }

  constructor(options = {}) {
    super();
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
    this.app.ROOT_NAME = path.basename(this.options.ROOT_PATH);

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
      this.emit('start', this.app);
    });
    this.app.on('error', (err, ctx) => {
      this.emit('error', err, ctx);
    });
    // 添加默认的 error 事件监听器
    setTimeout(() => {
      if (this.listenerCount('error') === 0) {
        this.on('error', (err, ctx) => {
          console.log('[default error callback]');
          console.log(err);
        });
      }
    }, 3000);
  }

}

module.exports = Astroboy;