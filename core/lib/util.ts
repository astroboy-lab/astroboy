import * as fse from 'fs-extra';

/**
 * ### 输出内容到文件
 *
 * @author Big Mogician
 * @export
 * @param {string} file
 * @param {*} data
 * @param {*} [options={}]
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
