/**
 * ## 构造函数类型
 *
 * @author Big Mogician
 * @export
 * @interface IConstructor
 * @template T
 */
export interface IConstructor<T> {
  new (...args: any[]): T;
}
