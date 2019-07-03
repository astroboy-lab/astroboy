import { Astroboy } from './core/Astroboy';
import { BaseClass } from './core/base/BaseClass';

// #region hack for commonjs
// 在<es7环境中使用commonjs语法require的时候，需要支持直接导出使用
exports = Astroboy;
exports.BaseClass = BaseClass;
exports.Controller = BaseClass;
exports.Service = BaseClass;
exports.Helper = BaseClass;
// 重置__esModule字段以支持tslib
Object.defineProperty(exports, '__esModule', { value: true });
// #endregion

// 在ts/es7+环境中，可以使用default和命名的ES导入声明
// 打开类型补偿和tslib后，可以使用各种导入声明
export default Astroboy;
export { BaseClass, BaseClass as Controller, BaseClass as Service, BaseClass as Helper };
