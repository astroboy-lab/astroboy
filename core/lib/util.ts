import * as fse from 'fs-extra';
import { Loader } from '../Loader';

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
 * ### 判断是否 Loader 子类
 * 1. 是否继承 Loader
 * 2. 有 load 方法
 *
 * @export
 * @param {(Loader<any, any> | { load(): Promise<void> })} loader
 * @returns
 */
export function isLoader(loader: Loader<any, any> | { load(): Promise<void> }) {
  if (loader instanceof Loader) {
    return true;
  }
  if (typeof loader.load === 'function') {
    return true;
  }

  return false;
}