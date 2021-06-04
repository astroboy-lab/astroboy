import * as fse from 'fs-extra';

/**
 * ### 输出内容到文件
 *
 * @author Big Mogician
 * @export
 * @param {string} file
 * @param {*} data
 * @param {*} [options={}]
 * @deprecated size version 3.0. Loader#load is asynchronous, using outputJsonAsync
 */
export function outputJsonSync(file: string, data: any, options: any = {}) {
  options = Object.assign(
    {
      spaces: 2,
      EOL: '\r\n',
    },
    options
  );
  fse.outputJsonSync(file, data, options);
}

/**
 * ### 异步输出内容到文件
 *
 * @author yidafu
 * @export
 * @param {string} file
 * @param {*} data
 * @param {fse.WriteOptions} [options={}]
 */
 export async function outputJsonAsync(file: string, data: any, options: fse.WriteOptions = {}) {
  options = Object.assign(
    {
      spaces: 2,
      EOL: '\r\n',
    },
    options
  );
  await fse.outputJson(file, data, options);
}

/**
 * ### 判断函数是否是异步函数
 *
 * @author yidafu
 * @export
 * @param {Function} func
 * @returns {boolean}
 * @example
 *
 * isAsyncFunction(async () => {}); // ==> true
 * isAsyncFunction(() => {}); // ==> false
 */
export function isAsyncFunction(func: Function) {
  return Object.prototype.toString.call(func) === '[object AsyncFunction]'
}