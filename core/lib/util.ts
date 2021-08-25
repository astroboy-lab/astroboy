import { EntryItem } from 'fast-glob/out/types/entries';
import * as fse from 'fs-extra';

const TYPING_FILE_EXTS = '.d.ts';

/**
 * ### Check the file is typing file or not.
 *
 * @author Big Mogician
 * @param {EntryItem} entry
 * @returns
 */
export function fileIsNotTypingFile(entry: EntryItem): Boolean {
  return typeof entry === 'string' ? !entry.endsWith(TYPING_FILE_EXTS) : !entry.path.endsWith(TYPING_FILE_EXTS);
}

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
