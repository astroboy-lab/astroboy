import * as glob from 'fast-glob';
import * as path from 'path';
import * as lodash from 'lodash'
import { EntryItem } from 'fast-glob/out/types/entries';
import { PureObject, IDir, ILoaderOptions, IPluginEntry, IBaseApplication } from '../definitions/core';

const TYPING_FILE_EXTS = '.d.ts';
const APP_EXTENSIONS = ['js', 'ts'];

/**
 * ### Check the file is typing file or not.
 *
 * @author Big Mogician
 * @param {EntryItem} entry
 * @returns
 */
function fileIsNotTypingFile(entry: EntryItem) {
  return typeof entry === 'string' ? !entry.endsWith(TYPING_FILE_EXTS) : !entry.path.endsWith(TYPING_FILE_EXTS);
}

/**
 * ### Base Loader
 *
 * @author Big Mogician
 * @export
 * @abstract
 * @class Loader
 * @template F
 * @template A
 */
export abstract class Loader<F extends PureObject, A extends IBaseApplication<F>> {
  protected dirs!: IDir[];
  protected app!: A;
  protected config!: F;

  constructor(options: Partial<ILoaderOptions<F, A>> = {}) {
    this.dirs = options.dirs || [];
    this.config = <F>options.config || {};
    this.app = <A>options.app || {};
  }

  abstract load(): Promise<void>;

  /**
   * ### Resolve Extensions
   *
   * @author Big Mogician
   * @protected
   * @param {string} path
   * @param {boolean} [resolveDevide=false]
   * @returns
   * @memberof Loader
   */
  protected resolveExtensions(path: string, resolveDevide: boolean = false) {
    let newPath = path;
    APP_EXTENSIONS.forEach(ext => (newPath = newPath.replace(`.${ext}`, '')));
    return resolveDevide ? newPath.replace(/\//g, '.') : newPath;
  }

  /**
   * ### Get Dirs
   *
   * @author Big Mogician
   * @protected
   * @param {(string | string[])} patterns
   * @param {(files: EntryItem[]) => void} callback
   * @memberof Loader
   */
  protected async globDirs(patterns: string | string[]): Promise<EntryItem[]> {
    const entries = await Promise.all(
      this.dirs.map((item) => {
        return this.globDir(item.baseDir, patterns);
      }),
    );

    return lodash.flatten(entries);
  }

  /**
   * ### Resolve Dir
   *
   * @author Big Mogician
   * @protected
   * @param {string} baseDir
   * @param {(string | string[])} patterns
   * @param {(files: EntryItem[]) => void} callback
   * @memberof Loader
   */
  protected async globDir(baseDir: string, patterns: string | string[]): Promise<EntryItem[]> {
    let newPatterns: string[] = [];
    if (typeof patterns === 'string') {
      newPatterns = [`${baseDir}${patterns}`];
    } else if (Array.isArray(patterns)) {
      newPatterns = patterns.map(pattern => {
        return `${baseDir}${pattern}`;
      });
    }
    const entries = await glob(newPatterns, { dot: true });
    return entries.filter(fileIsNotTypingFile);
  }

  /**
   * ### 获取插件的根目录
   * - 要求插件的入口文件必须放在插件根目录
   *
   * @author Big Mogician
   * @protected
   * @param {IPluginEntry} plugin
   * @returns
   * @memberof Loader
   */
  protected getPluginPath(plugin: IPluginEntry) {
    if (plugin.path) {
      return plugin.path;
    }
    const name = plugin.package || plugin.name!;
    const entryFile = require.resolve(name);
    return path.dirname(entryFile);
  }
}
