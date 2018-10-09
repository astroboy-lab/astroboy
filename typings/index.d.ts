/// <reference path="./plugins/astroboy-view.d.ts" />

interface ViewConfig {
    root?: string[];
    mapping?: { [key: string]: any };
    cache?: boolean;
    defaultExtension?: string;
    [key: string]: any;
}

interface Constructor<T> {
    new(...args: any[]): T;
}

interface VersionMap {
    [key: string]: string;
}

interface VersionMaps {
    [key: string]: VersionMap;
}

type ReturnAnyType<T = any> = T extends (...args: any[]) => infer R ? R : any;

type Router = (string | string[])[][];

declare const BASE_DIR: unique symbol;

declare interface Options {
    NODE_ENV: string;
    NODE_PORT: string;
    ROOT_PATH: string;
    APP_EXTENSIONS: ["js"] | ["js", "ts"];
}

interface DefaultLoader {}

declare module "astroboy" {
    import * as Koa from "koa";
    import { EventEmitter } from "events";

    interface Libs {}

    interface Config {
        view: ViewConfig;
        [key: string]: any;
    }

    abstract class AstroboyCore {
        /**
         * @description 获取完成配置字典
         * @returns {Config}
         * @memberof Context
         */
        public getConfig(): Config;

        /**
         * @description 获取具体某个 config 字段的值
         * @template K 字段 key
         * @template V 字段 value
         * @param {string} key
         * @returns {V}
         * @memberof Context
         */
        public getConfig<K extends keyof Config, V = Config[K]>(key: string): V;

        /**
         * @description 获取某个具体的 Lib 函数
         * @template PkgName 字符串包名
         * @template LibName 字符串 Lib 函数名
         * @template LibFunction 某个具体 Lib 函数
         * @param {PkgName} pkgName
         * @param {LibName} libName
         * @returns {LibFunction}
         * @memberof Context
         */
        public getLib<
            PkgName extends keyof Libs,
            LibName extends keyof Libs[PkgName],
            LibMethods = Libs[PkgName][LibName]
        >(pkgName: PkgName, libName: LibName): LibMethods;

        /**
         * @description 获取某个 Service 的构造函数
         * @template PkgName 字符串包名
         * @template ServiceName 字符串类名
         * @template ServiceClass 具体某个 Service 构造函数
         * @param {PkgName} pkgName
         * @param {ServiceName} serviceName
         * @returns {ServiceClass}
         * @memberof Context
         */
        public getServiceClass<
            PkgName extends keyof Services,
            ServiceName extends keyof Services[PkgName],
            ServiceClass = Services[PkgName][ServiceName]
        >(pkgName: PkgName, serviceName: ServiceName): ServiceClass;

        /**
         * @description 获取某个 Service 的实例
         * @template PkgName 字符串包名
         * @template ServiceName 字符串类名
         * @template ServiceInstance 具体某个 Service 的实例
         * @param {PkgName} pkgName
         * @param {ServiceName} serviceName
         * @returns {ServiceInstance}
         * @memberof Context
         */
        public getService<
            PkgName extends keyof Services,
            ServiceName extends keyof Services[PkgName],
            ServiceInstance = InstanceType<Services[PkgName][ServiceName]>
        >(pkgName: PkgName, serviceName: ServiceName): ServiceInstance;

        /**
         * @description 执行某具体 Service 上某个方法, 不推荐使用
         * @protected
         * @param {string} service
         * @param {string} method
         * @param {...any[]} args
         * @returns {Promise<any>}
         * @memberof AstroboyCore
         */
        protected callService(service: string, method: string, ...args: any[]): Promise<any>;

        /**
         * @description 执行某具体 Service 上某个方法
         * @template PkgName 包名
         * @template ServiceName 服务名
         * @template MethodName 方法名
         * @template Result 执行结果(一般异步)
         * @param {PkgName} pkgName
         * @param {ServiceName} serviceName
         * @param {MethodName} methodName
         * @param {...any[]} args
         * @returns {Result}
         * @memberof AstroboyCore
         */
        public invokeServiceMethod<
            PkgName extends keyof Services,
            ServiceName extends keyof Services[PkgName],
            MethodName extends keyof InstanceType<Services[PkgName][ServiceName]>,
            Result = ReturnAnyType<InstanceType<Services[PkgName][ServiceName]>[MethodName]>
        >(pkgName: PkgName, serviceName: ServiceName, methodName: MethodName, ...args: any[]): Result;
    }

    interface Context extends Koa.Context, AstroboyCore {
        readonly view: ContextView;

        /**
         * @description 渲染模版文件 异步
         * @param {...any[]} args
         * @returns {Promise<any>}
         * @memberof Context
         */
        render(...args: any[]): Promise<any>;
        renderView(...args: any[]): Promise<any>;
    }

    class App extends Koa {
        NODE_ENV: string;
        ROOT_PATH: string;
        ROOT_NAME: string;
        APP_EXTENSIONS: ["js"] | ["js", "ts"];

        readonly view: ViewManager;

        pkg: any;
        libs: Libs;
        env: string;
        router: Router;
        context: Context;
        services: Services;
        versionMap: VersionMaps;
        controllers: Controllers;

        public getConfig(): Config;

        public getConfig<K extends keyof Config, V = Config[K]>(key: string): V;

        public getLib<
            PkgName extends keyof Libs,
            LibName extends keyof Libs[PkgName],
            LibFunction = Libs[PkgName][LibName]
        >(pkgName: PkgName, libName: LibName): LibFunction;

        public getServiceClass<
            PkgName extends keyof Services,
            ServiceName extends keyof Services[PkgName],
            ServiceClass = Services[PkgName][ServiceName]
        >(pkgName: PkgName, serviceName: ServiceName): ServiceClass;
    }

    class BaseClass extends AstroboyCore {
        ctx: Context
        app: App
        config: Config
    }

    interface PkgServices {
        [path: string]: Constructor<BaseClass>;
    }

    interface Services {
        [pkgName: string]: PkgServices;
    }

    interface Controllers {
        [key: string]: Constructor<BaseClass>;
    }

    export class BaseService extends BaseClass {}

    export class BaseController extends BaseClass {}

    export default class Astroboy {
        readonly [BASE_DIR]: string;
        options: Options;
        app: App;
        private loader: DefaultLoader;

        constructor(options?: Partial<Options>);

        protected init(): void;
        public start(): void;
    }
}
