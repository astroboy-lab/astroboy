import glob = require('fast-glob');
import path = require('path');
import { EntryItem } from 'fast-glob/out/types/entries';
import { IInnerApplication, PureObject, IDir, ILoaderOptions, IPluginEntry } from '../definitions/core';

const TYPING_FILE_EXTS = '.d.ts';
const APP_EXTENSIONS = ['js', 'ts'];

function fileIsNotTypingFile(entry: EntryItem) {
  return typeof entry === 'string' ? !entry.endsWith(TYPING_FILE_EXTS) : !entry.path.endsWith(TYPING_FILE_EXTS);
}

export abstract class Loader<A extends IInnerApplication, F extends PureObject> {
  protected dirs!: IDir[];
  protected app!: A;
  protected config!: F;

  constructor(options: Partial<ILoaderOptions<A, F>> = {}) {
    this.dirs = options.dirs || [];
    this.config = <F>options.config || {};
    this.app = <A>options.app || {};
  }

  abstract load(): void;

  protected resolveExtensions(path: string, resolveDevide = false) {
    let newPath = path;
    APP_EXTENSIONS.forEach(ext => (newPath = newPath.replace(`.${ext}`, '')));
    return resolveDevide ? newPath.replace(/\//g, '.') : newPath;
  }

  protected globDirs(patterns: string | string[], callback: (files: EntryItem[]) => void) {
    this.dirs.forEach(item => {
      this.globDir(item.baseDir, patterns, callback);
    });
  }

  protected globDir(baseDir: string, patterns: string | string[], callback: (files: EntryItem[]) => void) {
    let newPatterns: string[] = [];
    if (typeof patterns === 'string') {
      newPatterns = [`${baseDir}${patterns}`];
    } else if (Array.isArray(patterns)) {
      newPatterns = patterns.map(pattern => {
        return `${baseDir}${pattern}`;
      });
    }
    const entries = glob.sync(newPatterns, { dot: true });

    callback(entries.filter(fileIsNotTypingFile));
  }

  /**
   * 获取插件的根目录
   *
   * 要求插件的入口文件必须放在插件根目录
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
