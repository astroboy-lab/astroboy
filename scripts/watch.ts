import chokidar = require('chokidar');
import chalk from 'chalk';
import { spawn } from 'child_process';

const watcher = chokidar.watch(['app', 'config', 'core', 'definitions', 'loader', 'plugins'], { cwd: process.cwd() });

function print(msg: string) {
  console.log(chalk.green(msg));
}

function notice(msg: string) {
  console.log(chalk.yellow(msg));
}

function error(msg: any) {
  console.log(chalk.red(msg));
}

function onChange(pathname: string) {
  notice('file changed -> ' + pathname);
  print('start recompile source code...');
  return new Promise<boolean | Error>(resolve => {
    spawn('make', ['compile'], {
      cwd: process.cwd(),
      env: process.env,
      stdio: ['pipe', process.stdout, process.stderr],
    })
      .on('exit', code => {
        resolve(code === 0);
      })
      .on('error', err => {
        resolve(err);
      });
  });
}

let dynamic_fn: any = null;

print('start watching ...');
watcher.on(
  'change',
  (dynamic_fn = async (pathname: string) => {
    watcher.off('change', dynamic_fn);
    const result = await onChange(pathname);
    watcher.on('change', dynamic_fn);
    if (result === true) {
      print('done.');
    } else if (result === false) {
      notice('failed.');
    } else {
      error(result);
    }
  })
);
