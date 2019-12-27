import * as lodash from 'lodash';
import { Loader } from '../core/Loader';
import { IInnerApplication, PureObject } from '../definitions/core';
import { IOptions } from '../definitions/config';

class AstroboyFnLoader extends Loader<Partial<IOptions>, IInnerApplication<Partial<IOptions>>> {
  load() {
    // 加载 Fn 配置
    let fnConfig: PureObject = {};
    this.globDirs(this.config.configPattern || [], entries => {
      entries.forEach(entry => {
        fnConfig = lodash.merge(fnConfig, require(entry as string));
      });
    });
    this.app.fnConfig = fnConfig;

    let fns: PureObject = {};
    this.dirs.forEach(item => {
      this.globDir(item.baseDir, this.config.pattern || [], entries => {
        if (entries.length > 0) {
          (<string[]>entries).forEach(entry => {
            const key = this.resolveExtensions(entry.split('fns/')[1], true);
            const config = fnConfig[key] || {};
            fns[key] = require(entry)(config.options || {});
          });
        }
      });
    });
    this.app.fns = fns;
  }
}

export = AstroboyFnLoader;
