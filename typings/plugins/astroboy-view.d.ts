/// <reference path="../index.d.ts" />

interface Constructor<T> {
    new(...args: any[]): T;
}

interface ViewEngine {
    render(...args: any[]): any;
    renderString(...args: any[]): any;
    [key: string]: any;
}

declare const RENDER: unique symbol;
declare const RENDER_STRING: unique symbol;

declare module "astroboy" {
    class ContextView {
        ctx: Context
        app: App
        viewManager: ViewManager
        config: ViewConfig

        constructor(ctx: Context)

        render(...args: any[]): Promise<any>

        [RENDER](): Promise<any>
        [RENDER_STRING](): ViewEngine
    }

    class ViewManager extends Map {
        config: ViewConfig;
        extMap: Map<string, any>;
        fileMap: Map<string, any>;

        /**
         * @description 注册模板引擎(构造函数)
         * @param {*} name
         * @param {*} viewEngine
         * @memberof ViewManager
         */
        use(name: string, viewEngine: Constructor<ViewEngine>): void;

        /**
         * @description 读取模板文件相对路径(相对 root)+文件名+后缀
         * @param {string} name
         * @returns {string}
         * @memberof ViewManager
         */
        resolve(name: string): string;

        /**
         * @description 遍历 names, 定位文件相对路径后返回
         * @author fancy
         * @param {string[]} names
         * @param {string} root
         * @returns {string}
         * @memberof ViewManager
         */
        resolvePath(names: string[], root: string): string;
    }
}
